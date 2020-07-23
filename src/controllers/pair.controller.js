const { pairService } = require("../services");

const wrapper = require("../wrapper");


exports.insert = (req, res) => {

    let transaction = req.body;

    pairService.insert(transaction)
        .then(onfulfilled => {

            res.status(200).json(onfulfilled);
        })
        .catch(onrejected => {

            res.status(400).json(onrejected);
        })
}

exports.select = (req, res) => {

    let name = req.params.name;

    wrapper.forexContract.get(name)
        .then(onfulfilled => {

            pairService.select(onfulfilled)
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

            pairService.authorize(onfulfilled)
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