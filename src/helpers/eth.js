const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const config = require("../../config/app.config");
const keystore = require("../../config/key.store");

const { Transaction, Receipt, Blob } = require("../models");

class Ethereum {

    constructor(_endPoint, _mnemonic) {

        this.hd = new HDWalletProvider(_mnemonic, _endPoint);
        this.web3 = new Web3(this.hd);
    }
    
    sign(message) {

        let account = this.web3.eth.accounts.decrypt(keystore, process.env.SECRET);
        
        let blob = new Blob({
            from: account.address,
            to: message.to,
            data: message.data,
            chainId: message.chainId,
            gas: message.gas,
        })

        return new Promise((resolve, reject) => {

            account.signTransaction(blob)
                .then(res => {

                    let transaction = new Transaction(res);
                    resolve(transaction);
                })
                .catch(err => {

                    reject(err);
                })
        })
    }

    send(tx) {

        let transaction = new Transaction(tx);
        
        let raw = transaction.rawTransaction;

        return new Promise((resolve, reject) => {

            this.web3.eth.sendSignedTransaction(raw)
                .then(res => {

                    let receipt = new Receipt(res);
                    resolve(receipt);
                })
                .catch(err => {

                    let revert = new Receipt(err);
                    reject(revert);
                })
        })
    }
}

const endPoint = `${config.infura.endPoint}${config.infura.key}`;
const mnemonic = process.env.MNEMONIC.trim();

module.exports = new Ethereum(endPoint, mnemonic);;