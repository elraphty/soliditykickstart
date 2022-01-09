# Solidity Kickstart

Solidity kickstart is a project that allows users create campaigns with a minimum contribution
users can contribute to the campaigns,  and admin can create requests.

Users have to vote before request funds can be disbursed

## Note
To use, you have to install metamask extension on your browser

## Getting Started

First, run the development server:

```bash
  npm run install
  # or
  yarn install
  
  npm run dev
  # or
  yarn dev
```

## Test
```
  npm run test_contract
```

## Deploy

Create a dotenv file and update these ENV variables

```
  WALLET_MNEMONIC="" // Your metamask wallet mnemomic words
  INFURA_ENDPOINT="" // infura project endpoint
  FACTORY_ADDRESS="" // factory address after deployment
```

```
  npm run compile
  npm run deploy
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
