const { ethereum, database } = require("./helpers");

const { broker } = require("./middelwares");

class LoopBack {

    constructor(events) {

        this.events = events;
    }

    start() {

        this.events.map(event => {
            this.listener(event);
        })
    }

    listener(event) {

        database.listen(event)
            .then(onfulfilled => {

                let q = onfulfilled.name;
                
                broker.subscribe(q)
                    .then(response => {

                        ethereum.send(response)
                            .then(res => {

                                console.log(res);
                                this.listener(event);
                            })
                            .catch(err => {

                                console.log(err);
                            })
                    })
                    .catch(error => {
                
                        console.error(error);
                    })
            })
            .catch(onrejected => {
                
                console.error(onrejected);
            })
    }
}

module.exports = new LoopBack([process.env.NEW_Q, process.env.NEW_MSG_Q]);