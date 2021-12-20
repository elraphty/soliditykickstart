const assert = require('assert');
const Web3 = require('web3');
const genanche = require('ganache-cli');

const provider = new genanche.provider();
const web3 = new Web3(provider);

const kickstartFactory = require('../build/KickstartFactory.json');
const kickstartCampaign = require('../build/Kickstart.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(kickstartFactory.KickstartFactory.abi)
    .deploy({ data: kickstartFactory.KickstartFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '2000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '2000000',
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    kickstartCampaign.Kickstart.abi,
    campaignAddress
  );
});

describe('KickstartCampaigns', () => {
  it('deploys a factory and a campaign', async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as an approver', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });

    const approverExists = await campaign.methods.approvers(accounts[1]).call();
    
    assert.ok(approverExists);
  });

  it('it does not allow  a contributor to be added as an approver more than once', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });

    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });

    const approversCount = await campaign.methods.approversCount().call();
    
    assert.equal(approversCount, 1);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methds.contribute().send({
        value: '1',
        from: accounts[1],
      });
      assert.fail();
    } catch (error) {
      assert(true);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[0],
    });

    await campaign.methods.createRequest('Buy flops', '100', accounts[1]).send({
      from: accounts[0],
      gas: '1000000',
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'Buy flops');
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods
      .createRequest('Buy flops', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    const beginningBal = await web3.eth.getBalance(accounts[1]);
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    const endingBal = await web3.eth.getBalance(accounts[1]);
    let diffBal = endingBal - beginningBal;
    diffBal = web3.utils.fromWei(diffBal.toString(), 'ether');
    diffBal = parseFloat(diffBal);

    assert(diffBal === 5);
  });
});
