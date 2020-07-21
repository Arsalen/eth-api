const { Acknowledgement } = require("../models");


exports.insert = (transaction) => {
        
    return new Promise((resolve, reject) => {
        
        let ack = new Acknowledgement({
            transactionHash: transaction.transactionHash,
            confirmation: true
        });

        resolve(ack);
    })
}

exports.select = (transaction) => {

    return new Promise((resolve, reject) => {

        let ack = new Acknowledgement({
            hash: transaction.transactionHash,
            confirmation: true
        });

        resolve(ack);
    })
}