const { ethereum } = require("../helpers");

const { AppContract } = require("./contracts");
const { AppDescriptor } = require("./descriptors");

const appContract = new AppContract(ethereum, AppDescriptor);

module.exports = {
    appContract
};