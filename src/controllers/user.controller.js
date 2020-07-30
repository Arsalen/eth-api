const { User } = require("../models");

const { userService } = require("../services");

exports.authorize = (req, res) => {

    let user = new User(req.body);

    userService.authorize(user)
        .then(response => {

            res.status(200).json({ result: { status: true, description: `Successfully initialized queue, bound to ${JSON.stringify(response)}` }, timestamp: new Date() });
        })
        .catch(error => {
                
            res.status(400).json({ result: { status: false, description: `Failed to initialize queue, due to ${JSON.stringify(error)}` }, timestamp: new Date() });
        })
}