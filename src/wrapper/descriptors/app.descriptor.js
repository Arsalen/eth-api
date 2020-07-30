const artifact = require("../../../artifacts/App");
const config = require("../../../config/app.config");

const AppDescriptor = {
    abi: artifact.abi,
    address: artifact.networks[config.network].address,
    network: config.network,
    gasLimit: config.gasLimit,
}

module.exports = AppDescriptor;