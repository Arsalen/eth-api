const { User } = require("../models");

const { userService } = require("../services");

const wrapper = require("../wrapper");

exports.authenticate = (req, res, next) => {

    let base64Credentials =  req.headers.authorization.split(' ')[1];
    let credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    let [username, password] = credentials.split(':');

    let user = new User({
        username: username,
        password: password
    })

    userService.authenticate(user)
        .then(response => {

            if(response.length) {
                
                req.user = response[0];
                next();
            } else {
                
                res.status(400).json({ result: { status: false, description: `Wrong password or username` }, timestamp: new Date() });
            }
        })
        .catch(error => {
                
            res.status(400).json({ result: { status: false, description: `Failed to authenticate, due to ${error}` }, timestamp: new Date() });
        })
}

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