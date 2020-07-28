const { userService } = require("../services");

const wrapper = require("../wrapper");


exports.authorize = (req, res) => {

    let user = req.body.user;

    wrapper.forexContract.authorize(user)
        .then(onfulfilled => {

            userService.authorize(onfulfilled)
                .then(response => {
                    res.status(200).json({ result: { status: true, description: `Successfully initialized queue, bound to ${JSON.stringify(response.bind)}` }, timestamp: new Date() });
                })
                .catch(error => {
                
                    res.status(400).json({ result: { status: false, description: `Failed because of ${JSON.stringify(error)}` }, timestamp: new Date() });
                })
        })
        .catch(onrejected => {

            res.status(400).json(onrejected);
        })
}