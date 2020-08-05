const cuid = require("cuid");

const { database } = require("../helpers");

const { broker } = require("../commons");

const { Stub } = require("../models");

exports.authorize = (user) => {

    return new Promise((resolve, reject) => {

        user.key = cuid();

        broker.newQ(user.key, user.tx)
            .then(onfulfilled => {

                user.q = onfulfilled;

                database.insert(user)
                    .then(response => {

                        let stub = new Stub({
                            hash: user.tx.transactionHash,
                            bind: user.key,
                            content: response
                        });

                        resolve(stub);
                    })
                    .catch(error => {

                        let stub = new Stub({
                            hash: user.tx.transactionHash,
                            bind: user.key,
                            content: error
                        });

                        reject(stub);
                    })
            })
            .catch(onrejected => {

                let stub = new Stub({
                    hash: user.tx.transactionHash,
                    bind: user.key,
                    content: onrejected
                });
                
                reject(stub);
            })
    })
}