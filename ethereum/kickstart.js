import {Kickstart as Campaign} from './build/Kickstart.json';
import web3 from './web3';

const kickstart = (address) => {
    return new web3.eth.Contract(Campaign.abi, address);
};

export default kickstart;