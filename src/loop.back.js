const Stream = require("stream");

const { ethereum } = require("./helpers");

const { broker, logger } = require("./commons");

class LoopBack extends Stream.Writable {

    constructor() {

        super();
    }

    init() {
        
        broker.pipe(this);
    }

    _write(data, encoding, cb) {

        let message = JSON.parse(data);

        ethereum.send(message)
            .then(onfulfilled => {

                logger.info(onfulfilled);
                cb();
            })
            .catch(onrejected => {

                logger.err(onrejected);
                cb();                
            })
    }
}

module.exports = new LoopBack();