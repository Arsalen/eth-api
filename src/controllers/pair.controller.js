const { pairService } = require("../services");

exports.insert = (req, res) => {
    
    let transaction = req.body;

    pairService.insert(transaction)
        .then(onfulfilled => {

            res.status(200).json({ result: { status: true, description: `Successfully submitted message, bound to ${JSON.stringify(onfulfilled)}` }, timestamp: new Date() });
        })
        .catch(onrejected => {

            res.status(400).json({ result: { status: false, description: `Failed to submit message, due to ${JSON.stringify(onrejected)}` }, timestamp: new Date() });
        })
}