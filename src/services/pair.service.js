const { database } = require("../helpers");

const { broker } = require("../commons");

const { Stub } = require("../models");

exports.insert = (key, transaction) => {

    return new Promise((resolve, reject) => {

        broker.newMsg(key, transaction)
            .then(onfulfilled => {

                database.insert(onfulfilled)
                    .then(response => {

                        let stub = new Stub({
                            hash: transaction.transactionHash,
                            bind: key,
                            content: response
                        });

                        resolve(stub);
                    })
                    .catch(error => {

                        let stub = new Stub({
                            hash: transaction.transactionHash,
                            bind: key,
                            content: error
                        });

                        reject(stub);
                    })
            })
            .catch(onrejected => {

                let stub = new Stub({
                    hash: transaction.transactionHash,
                    bind: key,
                    content: onrejected
                });

                reject(stub);
            })
    })
}