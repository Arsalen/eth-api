module.exports = class AppContract {

    constructor(provider, descriptor) {

        this.provider = provider;
        this.descriptor = descriptor;

        this.instance = new provider.web3.eth.Contract(descriptor.abi, descriptor.address);
    }

    authorize(user) {

        let checksum = this.provider.web3.utils.toChecksumAddress(user);

        const callData = this.instance.methods.authorize(checksum).encodeABI();
        const address = this.instance.options.address;
        const network = this.descriptor.network;
        const gasLimit = this.descriptor.gasLimit;

        let message = {
            to: address,
            data: callData,
            chainId: network,
            gas: gasLimit,
        }

        return new Promise((resolve, reject) => {

            this.provider.sign(message)
                .then(onfulfilled => {
                    
                    resolve(onfulfilled);
                })
                .catch(onrejected => {
                    
                    reject(onrejected);
                })
        })
    }
}