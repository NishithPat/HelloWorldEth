const HelloWorld = artifacts.require("./Hello.sol");

module.exports = async (deployer) => {
    await deployer.deploy(HelloWorld);
};