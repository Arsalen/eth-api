const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const config = require("../../config/app.config");
const keystore = require("../../config/key.store");

const { Account, Transaction, Receipt, Blob } = require("../models");

class Ethereum {

        constructor(_endPoint, _mnemonic) {

        this.hd = new HDWalletProvider(_mnemonic, _endPoint);
        this.web3 = new Web3(this.hd);

        this.account = new Account(this.web3, keystore, process.env.SECRET);
    }
    
    sign(message) {

        this.account.nonce++;
        
        let blob = new Blob({
            from: this.account.id.address,
            to: message.to,
            data: message.data,
            chainId: message.chainId,
            gas: message.gas,
            nonce: this.account.nonce
        })

        return new Promise((resolve, reject) => {

            this.account.id.signTransaction(blob)
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

        console.log("TX: ", JSON.stringify(tx))

        let transaction = new Transaction(tx);
        
        let raw = transaction.rawTransaction;

        return new Promise((resolve, reject) => {
            
            this.web3.eth.sendSignedTransaction(raw)
                .then(res => {
console.log("RESPONSE: ", JSON.stringify(res))
                    let receipt = new Receipt(res);
                    resolve(receipt);
                })
                .catch(err => {
console.error("ERROR: ", err)
                    reject(err);
                })
        })
    }
}

const endPoint = `${config.infura.endPoint}${config.infura.key}`;
const mnemonic = process.env.MNEMONIC.trim();

module.exports = new Ethereum(endPoint, mnemonic);;