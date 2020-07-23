class ForexContract {

    constructor(provider, descriptor) {

        this.provider = provider;
        this.descriptor = descriptor;

        this.instance = new provider.web3.eth.Contract(descriptor.abi, descriptor.address);
    }

    get(_name) {
        
        return new Promise((resolve, reject) => {

            let cb = this.instance.methods.get(_name).call;

            resolve(cb);
        })
    }

    authorize(_user) {

        let user = this.provider.web3.utils.toChecksumAddress(_user);

        const callData = this.instance.methods.authorize(user).encodeABI();
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

module.exports = ForexContract;