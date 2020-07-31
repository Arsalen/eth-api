const artifact = require("../../../artifacts/App");
const config = require("../../../config/app.config");

const AppDescriptor = {
    abi: artifact.abi,
    address: artifact.networks[config.blockchain.network].address,
    network: config.blockchain.network,
    gasLimit: config.blockchain.gasLimit,
}

module.exports = AppDescriptor;