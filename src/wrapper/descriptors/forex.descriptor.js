const artifact = require("../../../artifacts/Forex");
const config = require("../../../config/app.config");

const ForexDescriptor = {
    abi: artifact.abi,
    address: artifact.networks[config.network].address,
    network: config.network,
    gasLimit: config.gasLimit,
}

module.exports = ForexDescriptor;