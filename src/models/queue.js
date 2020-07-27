class Queue {

    constructor(props) {
        
        this.name = props.name;
        this.messages = props.messages;
        this.consumers = props.consumers;
        this.bind = props.bind;
    }
}

module.exports = Queue;