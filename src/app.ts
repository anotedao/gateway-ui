import { MetaMaskSDK } from '@metamask/sdk';

const sdk = new MetaMaskSDK();

const ethereum = sdk.getProvider();

const start = async () => {
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts',
    params: [],
  });

  console.log('request accounts', accounts);
};

start();
