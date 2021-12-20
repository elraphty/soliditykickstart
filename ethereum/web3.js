import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
  //   console.log('Accounts ====',web3.eth.getAccounts());
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/fba71ccb24c74e029bf59111b64d3f9a'
  );
  web3 = new Web3(provider);
}

export default web3;
