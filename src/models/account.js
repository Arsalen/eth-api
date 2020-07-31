module.exports = class Account {

    constructor(web3, keystore, secret) {

        this.id = web3.eth.accounts.decrypt(keystore, secret);

        web3.eth.getTransactionCount(this.id.address)
                .then(onfulfilled => {
                    this.nonce = onfulfilled;
                })
                .catch(onrejected => {
                    this.nonce = onrejected;
                })
    }

    signTransaction(blob) {
        this.id.signTransaction(blob);
    }

    sign(raw) {
        this.id.sign(raw);
    }

    encrypt(password) {
        this.id.encrypt(password);
    }

}