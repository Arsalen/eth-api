const { User } = require("../models");

const { userService } = require("../services");

const wrapper = require("../wrapper");


exports.authorize = (req, res) => {

    let user = new User(req.body);

    wrapper.forexContract.authorize(user.address)
        .then(onfulfilled => {

            user.tx = onfulfilled;

            userService.authorize(user)
                .then(response => {
                    res.status(200).json({ result: { status: true, description: `Successfully initialized queue, bound to ${JSON.stringify(response)}` }, timestamp: new Date() });
                })
                .catch(error => {
                
                    res.status(400).json({ result: { status: false, description: `Failed to initialize queue, due to ${JSON.stringify(error)}` }, timestamp: new Date() });
                })
        })
        .catch(onrejected => {

            res.status(400).json(onrejected);
        })
}