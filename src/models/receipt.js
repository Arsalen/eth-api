class Receipt {

    constructor(props) {

        this.blockHash = props.blockHash;
        this.blockNumber = props.blockNumber;
        this.contractAddress = props.contractAddress;
        this.cumulativeGasUsed = props.cumulativeGasUsed;
        this.from = props.from;
        this.gasUsed = props.gasUsed;
        this.logs = props.logs;
        this.logsBloom = props.logsBloom;
        this.status = props.status;
        this.to = props.to;
        this.transactionHash = props.transactionHash;
        this.transactionIndex = props.transactionIndex;
    }
}

module.exports = Receipt;