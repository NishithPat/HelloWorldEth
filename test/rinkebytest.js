const Hello = artifacts.require("./Hello.sol");

contract("test for rinkeby", accounts => {
    it("initial value of 'word' is 'Hello'", async () => {
        const helloInstance = await Hello.deployed();
        //console.log(accounts[0]);
        const word = await helloInstance.getter();
        console.log(word);
        assert.equal(word, "Hello");
    });
})