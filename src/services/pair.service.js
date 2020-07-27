const { database } = require("../helpers");

const { broker } = require("../middelwares");

exports.insert = (transaction) => {

    return new Promise((resolve, reject) => {

        broker.publish("123", transaction)
            .then(onfulfilled => {

                let key = onfulfilled.key;
                let field = "messages"
                
                database.increment(key, field)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
            .catch(onrejected => {

                reject(onrejected);
            })
    })
}