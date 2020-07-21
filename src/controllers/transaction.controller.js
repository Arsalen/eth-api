const { txService } = require("../services");
const { Transaction } = require("../models");



exports.insert = (req, res) => {

    let transaction = new Transaction(req.body);

        txService.insert(transaction)
            .then(onfulfilled => {
                
                res.status(200).json(onfulfilled);
            })
            .catch(onrejected => {
                
                res.status(400).json(onrejected);
            })
}

exports.select = (req, res) => {

    let transaction = new Transaction(req.body);

        txService.select(transaction)
            .then(onfulfilled => {
                
                res.status(200).json(onfulfilled);
            })
            .catch(onrejected => {
                
                res.status(400).json(onrejected);
            })
}