const Kickstart = require('./build/Campaign.json').Kickstart;
const web3 = require('./web3');

const kickstart = (address) => {
    return new web3.eth.Contract(Campaign.abi, address);
};

export default kickstart;