const NeDB = require("nedb");

class DataBase {
    
    constructor() {
        
        this.nedb = new NeDB({ filename: `./db/queues.db`, autoload: true });
    }

    insert(data) {

        return new Promise((resolve, reject) => {

            this.nedb.insert(data, (onrejected, onfulfilled) => {

                if(onfulfilled) {

                    this.nedb.emit(process.env.NEW_Q, onfulfilled);
                    resolve(onfulfilled);
                } else {

                    reject(onrejected);
                }
            });
        })
    }

    increment(key, field) {
        
        return new Promise((resolve, reject) => {

            this.nedb.update({ bind: key }, { $inc: { [field]: 1 } }, { returnUpdatedDocs: true }, (onrejected, onfulfilled, doc) => {

                if(onfulfilled) {

                    this.nedb.emit(process.env.NEW_MSG_Q, doc);
                    resolve(doc);
                } else {

                    reject(onrejected);
                }
            })
        })
    }
    
    listen(event) {

        return new Promise((resolve, reject) => {

            this.nedb.on(event, (data) => {

                if(data)
                    resolve(data);
            })
        })
    }
}

module.exports = new DataBase();