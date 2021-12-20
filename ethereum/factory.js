import Factory   from './build/KickstartFactory.json';
import web3 from './web3';

const instance = new web3.eth.Contract(Factory.KickstartFactory.abi, process.env.FACTORY_ADDRESS);

export default instance;