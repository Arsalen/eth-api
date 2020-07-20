class Transaction {

    constructor(props) {
        
        this.messageHash = props.messageHash;
        this.v = props.v;
        this.r = props.r;
        this.s = props.s;
        this.rawTransaction = props.rawTransaction;
        this.transactionHash = props.transactionHash;
    }
}

module.exports = Transaction;