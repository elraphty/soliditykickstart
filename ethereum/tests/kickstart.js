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
});
