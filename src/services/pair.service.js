const { Receipt, Pair } = require("../models");

const { ethereum } = require("../helpers");


exports.insert = (transaction) => {

    return new Promise((resolve, reject) => {

        ethereum.send(transaction)
            .then(onfulfilled => {

                let result = onfulfilled;

                let receipt = new Receipt(result);

                resolve(receipt);
            })
            .catch(onrejected => {

                let result = onrejected;

                let receipt = new Receipt(result);

                reject(receipt);
            })
    })
}

exports.select = (cb) => {

    return new Promise((resolve, reject) => {

        cb()
            .then(onfulfilled => {

                let result = onfulfilled;

                let pair = new Pair({
                    rate: result.rate,
                    timestamp: result.timestamp
                });

                resolve(pair);
            })
            .catch(onrejected => {

                let result = onrejected;

                reject(result);
            })
    })
}

exports.authorize = (transaction) => {

    return new Promise((resolve, reject) => {

        ethereum.send(transaction)
            .then(onfulfilled => {

                let result = onfulfilled;

                let receipt = new Receipt(result);

                resolve(receipt);
            })
            .catch(onrejected => {

                let result = onrejected;

                let receipt = new Receipt(result);

                reject(receipt);
            })
    })
}