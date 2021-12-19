const KickstartFactory = rquire('./build/KickstartFactory.json').KickstartFactory;
const web3 =  require('./web3');

const instance = new web3.eth.Contract(KickstartFactory.abi, "0xb2d010c45b5d803185B0ec61bDf5595DEa058B94");

export default instance;