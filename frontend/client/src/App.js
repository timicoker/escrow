import React, { Component, useState } from 'react';
import Escrow from './contracts/Escrow.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [balance, setBalance] = useState(undefined)

  useEffect(()=>{
    initialize()
  },[])

  async function initialize() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Escrow.networks[networkId];
    const contract = new web3.eth.Contract(
      Escrow.abi,
      deployedNetwork && deployedNetwork.address,
    );
    setWeb3(web3);
    setAccounts(accounts);
    setContract(contract);
    updateBalance();
  };

  async function updateBalance() {
    const balance = await contract.methods.balanceOf().call();
    setBalance( balance );
  };

  async function deposit(e) {
    e.preventDefault();
    await contract.methods.deposit().send({
      from: accounts[0], 
      value: e.target.elements[0].value
    });
    updateBalance();
  }

  async function release() {
    await contract.methods.release().send({
      from: accounts[0], 
    });
    updateBalance();
  }

    if (!web3) {
      return <div>Loading...</div>;
    }

    return (
      <div className="container">
        <h1 className="text-center">Escrow</h1>

        <div className="row">
          <div className="col-sm-12">
             <p>Balance: <b>{balance}</b> wei </p>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={e => deposit(e)}>
              <div className="form-group">
                <label htmlFor="deposit">Deposit</label>
                <input type="number" className="form-control" id="deposit" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-sm-12">
             <button onClick={() => release()} type="submit" className="btn btn-primary">Release</button>
          </div>
        </div>
      </div>
    );
  }


export default App;
