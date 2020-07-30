const { database } = require("../helpers");

module.exports = (req, res, next) => {

    let base64Credentials =  req.headers.authorization.split(' ')[1];
    let credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    let [username, password] = credentials.split(':');
    
    database.find({username: username, password: password})
            .then(onfulfilled => {

                if(onfulfilled.length) {
                
                    req.user = onfulfilled[0];
                    next();
                } else {
    
                    res.status(400).json({ result: { status: false, description: `Wrong password or username` }, timestamp: new Date() });
                }
            })
            .catch(onrejected => {
                
                res.status(400).json({ result: { status: false, description: `Failed to authenticate, due to ${JSON.stringify(onrejected)}` }, timestamp: new Date() });
            })
}