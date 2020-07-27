class QMessage {

    constructor(props) {
        
        this.key = props.key;
        this.exchange = props.exchange;
        this.data = props.data;
    }
}

module.exports = QMessage;