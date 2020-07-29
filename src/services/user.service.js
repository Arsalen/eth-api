const cuid = require("cuid");

const { database } = require("../helpers");

const { broker } = require("../middelwares");

exports.authorize = (user) => {

    return new Promise((resolve, reject) => {

        user.key = cuid();

        broker.newQ(user.key, user.tx)
            .then(onfulfilled => {

                user.q = onfulfilled;

                database.insert(user)
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