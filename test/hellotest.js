const Hello = artifacts.require("./Hello.sol");

contract("Hello", accounts => {
    it("initial value of 'word' is 'Hello'", async () => {
        const helloInstance = await Hello.deployed();

        const word = await helloInstance.getter();
        console.log(word);
        assert.equal(word, "Hello");
        console.log(accounts[0]);
        console.log("balance of accounts[0] ", await web3.eth.getBalance(accounts[0]));
        console.log(accounts[1]);
        console.log("balance of accounts[1] ", await web3.eth.getBalance(accounts[1]));
    });

    it("setter function changes 'word'", async () => {
        const helloInstance = await Hello.deployed();
        await helloInstance.setter("Hey", { from: accounts[1] });

        const updatedWord = await helloInstance.getter();
        console.log(updatedWord);

        assert.equal(updatedWord, "Hey");
    });

    it("deposits ether", async () => {
        const helloInstance = await Hello.deployed();
        let depositAmount = web3.utils.toWei('1', 'ether');
        let accountBalance = await web3.eth.getBalance(accounts[1]);
        console.log("before balance of accounts[1]", accountBalance);

        await helloInstance.deposit({ from: accounts[1], value: depositAmount });

        accountBalance = await web3.eth.getBalance(accounts[1]);
        console.log("after balance of accounts[1]", accountBalance);

        let contractEth = await helloInstance.contractBalance();
        console.log(contractEth.toString());

        assert.equal(web3.utils.toWei('1', 'ether'), contractEth.toString());
    })

    it("deposits ether from another account", async () => {
        const helloInstance = await Hello.deployed();
        let contractEth = await helloInstance.contractBalance();
        console.log("before second deposit", contractEth.toString());
        assert.equal(web3.utils.toWei('1', 'ether'), contractEth.toString()); //original deposit

        let depositAmount = web3.utils.toWei('2', 'ether');
        await helloInstance.deposit({ from: accounts[2], value: depositAmount });

        contractEth = await helloInstance.contractBalance();
        console.log("after second deposit", contractEth.toString())
        assert.equal(web3.utils.toWei('3', 'ether'), contractEth.toString());
    })

    it("checks balance of deposit addresses", async () => {
        const helloInstance = await Hello.deployed();

        const depositOfAccount1 = await helloInstance.BalanceAtAddress({ from: accounts[1] });
        const depositOfAccount2 = await helloInstance.BalanceAtAddress({ from: accounts[2] });

        console.log(depositOfAccount1.toString());
        console.log(depositOfAccount2.toString());

        assert.equal(web3.utils.toWei('1', 'ether'), depositOfAccount1.toString());
        assert.equal(web3.utils.toWei('2', 'ether'), depositOfAccount2.toString());
    })

    it("allows withdrawal", async () => {
        //       const helloInstance = await Hello.deployed();
        //       let initialBalanceOfAccount1 = await web3.eth.getBalance(accounts[1]);
        //       console.log("initial balance of account1 ", initialBalanceOfAccount1);

        //        await helloInstance.withdraw(web3.utils.toWei('0.5', 'ether'), { from: accounts[1] });
        //        let updatedBalanceOfAccount1 = await web3.eth.getBalance(accounts[1]);
        //        console.log("updated balance of account1 ", updatedBalanceOfAccount1);

        //assert.equal(parseInt(initialBalanceOfAccount1) + parseInt(web3.utils.toWei('0.5', 'ether')), parseInt(updatedBalanceOfAccount1));
        //difference because of gas cost

        const helloInstance = await Hello.deployed();
        let oldContractEth = await helloInstance.contractBalance();
        console.log(parseInt(oldContractEth));

        await helloInstance.withdraw(web3.utils.toWei('0.5', 'ether'), { from: accounts[1] });

        let newContractEth = await helloInstance.contractBalance();
        console.log(parseInt(newContractEth));

        assert.equal(parseInt(oldContractEth) - parseInt(web3.utils.toWei('0.5', 'ether')), parseInt(newContractEth));
    })
});