const { database } = require("../helpers");

const { broker } = require("../middelwares");

exports.insert = (key, transaction) => {

    // console.log(key, transaction)

    return new Promise((resolve, reject) => {

        broker.newMsg(key, transaction)
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