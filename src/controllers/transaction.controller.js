const { txService } = require("../services");
const { Transaction } = require("../models");

const wrapper = require("../wrapper");


exports.insert = (req, res) => {

    let transaction = new Transaction(req.body);

        txService.insert(transaction)
            .then(onfulfilled => {
console.log("SUCCESS: ", onfulfilled)

                res.status(200).json(onfulfilled);
            })
            .catch(onrejected => {
console.log("ERROR: ", onrejected)

                res.status(400).json(onrejected);
            })
}

exports.select = (req, res) => {

    let name = req.params.name;

    wrapper.forexContract.get(name)
        .then(onfulfilled => {

            let cb = onfulfilled;

            txService.select(cb)
                .then(response => {
                
                    res.status(200).json(response);
                })
                .catch(error => {
                
                    res.status(400).json(error);
                })
        })
        .catch(onrejected => {
        
            res.status(400).json(onrejected);
        })

        
}

exports.authorize = (req, res) => {

    let user = req.body.user;

    wrapper.forexContract.authorize(user)
        .then(onfulfilled => {

            let transaction = onfulfilled;

            txService.authorize(transaction)
                .then(response => {
                
                    res.status(200).json(response);
                })
                .catch(error => {
                
                    res.status(400).json(error);
                })
        })
        .catch(onrejected => {

            res.status(400).json(onrejected);
        })
}