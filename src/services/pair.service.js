const { Pair } = require("../models");

const { ethereum } = require("../helpers");


exports.insert = (transaction) => {

    return new Promise((resolve, reject) => {

        ethereum.send(transaction)
            .then(onfulfilled => {

                resolve(onfulfilled);
            })
            .catch(onrejected => {

                reject(onrejected);
            })
    })
}

exports.select = (cb) => {

    return new Promise((resolve, reject) => {

        cb()
            .then(onfulfilled => {

                let pair = new Pair({
                    rate: onfulfilled.rate,
                    timestamp: onfulfilled.timestamp
                });

                resolve(pair);
            })
            .catch(onrejected => {

                reject(onrejected);
            })
    })
}

exports.authorize = (transaction) => {

    return new Promise((resolve, reject) => {

        ethereum.send(transaction)
            .then(onfulfilled => {

                resolve(onfulfilled);
            })
            .catch(onrejected => {

                reject(onrejected);
            })
    })
}