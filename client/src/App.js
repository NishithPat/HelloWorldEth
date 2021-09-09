import React, { useEffect, useState } from "react";
import Hello from "./contracts/Hello.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const defaultFormData = {
  wordSetter: "",
  depositSetter: ""
};

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);

  const [word, setWord] = useState(undefined);
  const [wordExists, setWordExists] = useState(false);
  const [contractEth, setContractEth] = useState(undefined);

  const [inputValue, setInputValue] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDapp = async () => {
      try {
        const web3Instance = await getWeb3();
        const accountsInstance = await web3Instance.eth.getAccounts();

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = Hello.networks[networkId];

        console.log(Hello.abi);
        console.log(deployedNetwork.address);

        const instance = new web3Instance.eth.Contract(
          Hello.abi,
          deployedNetwork && deployedNetwork.address,
        );
        console.log(accountsInstance);

        setWeb3(web3Instance);
        setAccounts(accountsInstance);
        setContract(instance);

        await listenMMAccount(web3Instance);
        await chainchange(web3Instance);

      } catch (error) {
        console.log(error);
      }
    }

    loadDapp();
  }, [])

  async function listenMMAccount(web3Obj) {
    window.ethereum.on("accountsChanged", async () => {
      // Time to reload your interface with accounts[0]!
      const accountsInstance = await web3Obj.eth.getAccounts();
      // accounts = await web3.eth.getAccounts();
      console.log(accountsInstance);
      setAccounts(accountsInstance);
    });
  }

  async function chainchange(web3Obj) {
    window.ethereum.on("chainChanged", async () => {
      const networkId = await web3Obj.eth.net.getId();
      const deployedNetwork = Hello.networks[networkId];

      console.log(deployedNetwork.address);

      const instance = new web3Obj.eth.Contract(
        Hello.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setContract(instance);
    })
  }

  const getStoredWord = async () => {
    try {
      console.log(contract.methods)
      const returnedWord = await contract.methods.getter().call();
      console.log(returnedWord);
      setWord(returnedWord);
      setWordExists(true);
    } catch (e) {
      console.log(e);
      setWord(undefined);
      setWordExists(false);
    }
  }

  const getContractEth = async () => {
    const contractEthreturned = await contract.methods.contractBalance().call();
    setContractEth(web3.utils.fromWei(contractEthreturned, 'ether'));
  }

  const handleChange = (e) => {
    console.log(e.target.id);
    if (e.target.id == "wordSetter") {
      setInputValue(e.target.value);
    } else if (e.target.id == "depositSetter") {
      setDepositValue(e.target.value);
    } else if (e.target.id == "withdrawSetter") {
      setWithdrawValue(e.target.value);
    }
  }

  const changeStoredWord = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contract.methods.setter(inputValue).send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setInputValue("");
  }

  const deposit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contract.methods.deposit().send({ from: accounts[0], value: web3.utils.toWei(depositValue, 'ether') });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setDepositValue("");
  }

  const withdraw = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contract.methods.withdraw(web3.utils.toWei(withdrawValue, 'ether')).send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setWithdrawValue("");
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <>
      <div className="App">
        <b>{loading && "...loading"}</b>

        <p>Account0 Address: {accounts[0]}</p>
        {/*<p>Account1 Address: {accounts[1]}</p>*/}
        <p>Contract Address: {contract._address}</p>
        <br />
        <button onClick={getStoredWord}>Get word stored on contract</button>
        <p>{wordExists && word}</p>

        <br />

        <form onSubmit={changeStoredWord}>
          <label htmlFor="wordSetter">Change word stored on contract: </label>
          <input type="text" id="wordSetter" value={inputValue} onChange={handleChange} />
          <button type="submit">Change</button>
        </form>

        <br />

        <button onClick={getContractEth}>Ether stored in contract</button>
        <p>{contractEth}</p>

        <br />

        <form onSubmit={deposit}>
          <label htmlFor="depositSetter">Value to be deposited(in ether)</label>
          <input type="number" id="depositSetter" value={depositValue} onChange={handleChange} />
          <button type="submit">Deposit</button>
        </form>

        <form onSubmit={withdraw}>
          <label htmlFor="withdrawSetter">Value to be withdrawn(in ether)</label>
          <input type="number" id="withdrawSetter" value={withdrawValue} onChange={handleChange} />
          <button type="submit">Withdraw</button>
        </form>

      </div>
    </>
  )
}

export default App;
