class Acknowledgement {

    constructor(props) {

        this.hash = props.transactionHash;
        this.confirmation = props.confirmation;
    }
}

module.exports = Acknowledgement;