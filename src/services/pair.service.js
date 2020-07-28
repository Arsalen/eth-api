const { database } = require("../helpers");

const { broker } = require("../middelwares");

exports.insert = (transaction) => {

    return new Promise((resolve, reject) => {

        broker.newMsg("123", transaction)
            .then(onfulfilled => {

                database.insert(onfulfilled)
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