const { ethereum } = require("../helpers");

const { ForexContract } = require("./contracts");
const { ForexDescriptor } = require("./descriptors");

const forexContract = new ForexContract(ethereum, ForexDescriptor);

module.exports = {
    forexContract
};