const Stream = require("stream");

const { ethereum, database } = require("./helpers");

const { broker } = require("./middelwares");

class LoopBack extends Stream.Writable {

    constructor() {

        super();
    }

    init() {
        
        broker.pipe(this);
    }

    _write(data, encoding, cb) {

        console.log("WRITE");

        let message = data.toString()

        setTimeout(() => {

            console.log("[x] received %s", message, "\n");
            
            cb();
        }, 5000);
    }
}

module.exports = new LoopBack();