import { useState } from "react";
import React from "react";
import { DynamicContextProvider, DynamicWidget, FilterChain, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";

import SignMessage from './SignMessage.tsx';
import Balance from './Balance.tsx';
import Predict from "./Predict.tsx";
import './App.css';

import {
  StarknetIcon,
  EthereumIcon,
} from '@dynamic-labs/iconic';
import { RpcProvider, Contract } from "starknet";


const App = () => {
  const [amount, setAmount] = useState('');

  const [transactions, setTransactions] = useState([
    // Sample data
    { date: '2022-01-01', hash: '0x123', amount: 1, type: 'Buy', currentValue: 50000 },
    { date: '2022-02-01', hash: '0x456', amount: 2, type: 'Sell', currentValue: 45000 },
  ]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const locale = {
    en: {
      dyn_login: {
        title: {
          all: "Hello",
        },
      },
    },
  };

  const StarkWallets = {
    label: { icon: <StarknetIcon /> },
    walletsFilter: FilterChain('STARK'),
    recommendedWallets: [
      {
        walletKey: 'braavos',
        label: 'New'
      },
    ],
  };

  const views = [
    {
      type: 'wallet-list',
      tabs: {
        items: [
          
          StarkWallets,
        ]
      }
    }
  ];


  return (
    <DynamicContextProvider
        settings={{
          environmentId: "3098d7de-c530-4d38-b982-4951515795db",
          walletConnectors: [StarknetWalletConnectors],
          overrides: {
            views: views,
          },
      }}

      locale={locale}
    >
      <DynamicWidget />
      <Balance></Balance>
      <div className="card w-100 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
        
          <h2 className="card-title">Will the price of BTC go above 70K by 2024?</h2>
        
          <input 
            type="number" 
            value={amount} 
            onChange={handleAmountChange} 
            placeholder="Enter amount" 
            className="input input-bordered mt-4"
          />
          <div className="card-actions mt-4">
            <Predict></Predict>
            <button className="btn btn-secondary ml-4">No</button>
          </div>
          <table className="table w-96 mt-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hash</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Close Position</th>
                <th>Current Value</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td><a href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank" rel="noreferrer">{transaction.hash}</a></td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td><button className="btn btn-outline btn-accent">Close</button></td>
                  <td>{transaction.currentValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DynamicContextProvider>
  )
}

export default App;
