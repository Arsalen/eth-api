const config = require("../../config/app.config");
const amqp = require("amqplib/callback_api");

const { Queue, QMessage } = require("../models")

class Broker {

    constructor(type) {

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

            let message = new QMessage({
                key: key,
                exchange: process.env.EXCHANGE,
                data: data
            })

            if(ok)
                resolve(message);

            reject(message)
        })
    }

    subscribe(q) {

        const self = this;

        return new Promise((resolve, reject) => {

            self.channel.consume(q, function(message) {

                let data = JSON.parse(message.content);

                if(data)
                    resolve(data);

                reject(null);
            }, {
                noAck: true
            })
        })
    }

    initQ(key, transaction) {
        
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

                    let buffer = Buffer.from(JSON.stringify(transaction));

                    self.channel.publish(process.env.EXCHANGE, key, buffer);

                    let queue = new Queue({
                        name: q.queue,
                        messages: q.messageCount,
                        consumers: q.consumerCount,
                        bind: key
                    })

                    resolve(queue);
                })
            })
        })
    }
}

const type = "direct";

module.exports = new Broker(type);