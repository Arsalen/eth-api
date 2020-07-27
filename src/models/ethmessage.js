class EthMessage {

    constructor(props) {
        
        this.data = props.data;
        this.to = props.to;
        this.chainId = props.chainId;
        this.gas = props.gas;
    }
}

module.exports = EthMessage;