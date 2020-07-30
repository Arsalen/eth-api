const Stream = require("stream");

const config = require("../../config/app.config");
const amqp = require("amqplib/callback_api");

const { Queue, Message } = require("../models")

class Broker extends Stream.Readable {

    constructor(type) {

        super();

        const self = this;

        this.start()
            .then(onfulfilled => {

                    onfulfilled.assertExchange(config.broker.exchange, type, {
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

            amqp.connect(config.broker.endPoint, function(connectionerror, connection) {

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

    _read(size) {

        // console.log("READ");

        if(!size)
            this.push(null);
    }

    publish(key, data) {

        const self = this;

        return new Promise((resolve, reject) => {

            let buffer = Buffer.from(JSON.stringify(data));

            let ok = self.channel.publish(config.broker.exchange, key, buffer);

            if(ok)
                resolve(true);

            reject(false);
        })
    }

    subscribe(queue) {

        const self = this;

        self.channel.consume(queue, function(data) {

            let buffer = Buffer.from(data.content)

            self.push(buffer);

        }, {
            noAck: true
        })
    }

    newMsg(key, data) {

        const self = this;

        return new Promise((resolve, reject) => {

            let message = new Message({
                content: data,
                bind: key
            })

            self.publish(key, data)
                .then(onfulfilled => {

                    resolve(message, onfulfilled);
                })
                .catch(onrejected => {

                    reject(message, onrejected)
                })
        })
    }

    newQ(key, data) {
        
        const self = this;

        return new Promise((resolve, reject) => {

            self.channel.assertQueue('', {
                durable: false
            }, function(qerror, q) {    

                if(qerror)
                    reject(qerror);
    
                self.channel.bindQueue(q.queue, config.broker.exchange, key, null, function(binderror, bind) {
    
                    if(binderror)
                        reject(binderror);

                    let queue = new Queue({
                        name: q.queue,
                        bind: key
                    })

                    self.publish(key, data)
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

module.exports = new Broker(config.broker.type);