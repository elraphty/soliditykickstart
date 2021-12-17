const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const kickstartFactoryPath = path.resolve(__dirname, 'contracts', 'KickstartFactory.sol');
const source = fs.readFileSync(kickstartFactoryPath, 'utf8');

const kickstartPath = path.resolve(__dirname, 'contracts', 'Kickstart.sol');
const source1 = fs.readFileSync(kickstartPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'KickstartFactory.sol': {
      content: source,
    },
    'Kickstart.sol': {
      content: source1,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts;

fs.ensureDirSync(buildPath);

for (let contract in contracts) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(".sol", ".json")),
      contracts[contract]
    );
}