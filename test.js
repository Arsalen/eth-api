require("dotenv").config({path: ".env"});
const HDWalletProvider = require("truffle-hdwallet-provider");
const ethers = require('ethers');
const Web3 = require('web3');
const contract = require('./artifacts/App');
const config = require("./config/app.config");

const mnemonic = process.env.MNEMONIC;

const endPoint = `${config.infura.endPoint}${config.infura.key}`;

const wallet = ethers.Wallet.fromMnemonic(mnemonic);

const provider = new HDWalletProvider(mnemonic, endPoint);
const web3 = new Web3(provider);

const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);

const contractInstance = new web3.eth.Contract(contract.abi, contract.networks['3'].address);

// contractInstance.methods.authorize("0xaddress").send({ from: account.address })
//     .then(onfulfilled => {
//         console.log(onfulfilled);
//     })
//     .catch(onrejected => {
//         console.error(onrejected);
//     });