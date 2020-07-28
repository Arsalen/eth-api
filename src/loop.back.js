const { ethereum, database } = require("./helpers");

const { broker } = require("./middelwares");

class LoopBack {

    constructor() {

    }

    init() {

        broker.on(process.env.EVENT, (message, queue) => {

            console.log("[x] received %s from %s", JSON.stringify(message), queue, "\n");
        })
    }
}

module.exports = new LoopBack();