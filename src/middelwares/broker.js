const EE = require("events").EventEmitter;

const config = require("../../config/app.config");
const amqp = require("amqplib/callback_api");

const { Queue, QMessage } = require("../models")

class Broker extends EE {

    constructor(type) {

        super();

        const self = this;

        this.start()
            .then(onfulfilled => {

                    onfulfilled.assertExchange(process.env.EXCHANGE, type, {
                        durable: true
                    }, function(error, success) {

                        self.channel = onfulfilled;
                    })
            })
            .catch(onrejected => {
                self.channel = onrejected;
            })
    }

    start() {

        return new Promise((resolve, reject) => {

            amqp.connect(config.brokerEndPoint, function(connectionerror, connection) {

                if(connectionerror)
                    reject(connectionerror);
    
                connection.createChannel(function(channelerror, channel) {
    
                    if(channelerror)
                        reject(channelerror);
    
                    resolve(channel);
                });
    
            })
        })
    }

    publish(key, data) {

        const self = this;

        return new Promise((resolve, reject) => {

            let buffer = Buffer.from(JSON.stringify(data));

            let ok = self.channel.publish(process.env.EXCHANGE, key, buffer);

            if(ok)
                resolve(true);

            reject(false);
        })
    }

    subscribe(q) {

        const self = this;

        self.channel.consume(q, function(buffer) {

            let message = JSON.parse(buffer.content);

            self.emit(process.env.EVENT, message, q);

        }, {
            noAck: true
        })
    }

    newMsg(key, transaction) {

        const self = this;

        return new Promise((resolve, reject) => {

            let message = new QMessage({
                content: transaction,
                bind: key
            })

            self.publish(key, transaction)
                .then(onfulfilled => {

                    resolve(message, onfulfilled);
                })
                .catch(onrejected => {

                    reject(message, onrejected)
                })
        })
    }

    newQ(key, transaction) {
        
        const self = this;

        return new Promise((resolve, reject) => {

            self.channel.assertQueue('', {
                durable: false
            }, function(qerror, q) {    

                if(qerror)
                    reject(qerror);
    
                self.channel.bindQueue(q.queue, process.env.EXCHANGE, key, null, function(binderror, bind) {
    
                    if(binderror)
                        reject(binderror);

                    let queue = new Queue({
                        name: q.queue,
                        bind: key
                    })

                    self.publish(key, transaction)
                        .then(onfulfilled => {

                            setTimeout(() => {
                                self.subscribe(queue.name);
                            }, 5000);
                            resolve(queue, onfulfilled);
                        })
                        .catch(onrejected => {

                            reject(queue, onrejected)
                        })
                })
            })
        })
    }
}

module.exports = new Broker(process.env.TYPE);