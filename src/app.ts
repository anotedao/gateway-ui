import { MetaMaskSDK } from '@metamask/sdk';
import { AnoteAbi } from './anoteabi';
import { ethers, parseEther } from "ethers";
import $ from "jquery";

// const sdk = new MetaMaskSDK();

// const ethereum = sdk.getProvider();

const contractAddress = "0xc2952c27f78C5616bf4eeE1EA40E9dFb3fA1e900";

const start = async () => {
  // const accounts = await ethereum.request({
  //   method: 'eth_requestAccounts',
  //   params: [],
  // });

  let signer = null;

  let provider;
  if (window.ethereum == null) {

      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed so are
      // only have read-only access
      // console.log("MetaMask not installed; using read-only defaults");
      // provider = ethers.getDefaultProvider();

  } else {

      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum)

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, AnoteAbi, signer);
      // contract.connect(provider);

      // var tx = await contract.deposit("fdsafsdafdsa", 100000000);

      // await tx.wait()

      const options = {value: parseEther("0.001")};

      var tx = await contract.withdraw(options);
      await tx.wait();

      console.log(tx);
  
  }
  
};

// start();

if (window.ethereum == null || window.ethereum == undefined) {
  $("#loading").fadeOut(function() {
    $("#error").fadeIn();
  });
} else {
  $("#loading").fadeOut(function() {
    $("#success").fadeIn();
  });
}