const wrapper = require("../wrapper");

exports.authorize = (req, res, next) => {

    let address = req.body.address;

    wrapper.appContract.authorize(address)
        .then(onfulfilled => {

            req.body.tx = onfulfilled;
            next();
        })
        .catch(onrejected => {

            res.status(400).json({ result: { status: false, description: `Failed to sign, due to ${JSON.stringify(onrejected)}` }, timestamp: new Date() });
        })
}