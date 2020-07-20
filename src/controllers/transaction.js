const { txService } = require("../services");



exports.insert = (req, res) => {

        txService.insert()
            .then(onfulfilled => {
                
                res.status(200).json(onfulfilled);
            })
            .catch(onrejected => {
                
                res.status(400).json(onrejected);
            })
}

exports.select = (req, res) => {

        txService.select()
            .then(onfulfilled => {
                
                res.status(200).json(onfulfilled);
            })
            .catch(onrejected => {
                
                res.status(400).json(onrejected);
            })
}