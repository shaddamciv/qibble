import React from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import { constants } from 'starknet';
import { WalletClient, Transport } from 'viem';
import { StarknetWalletConnectorType } from '@dynamic-labs/starknet';

const Predict = () => {
  const { primaryWallet } = useDynamicContext();

  const signMessage = async () => {
    if (!primaryWallet) return;

    const connector = primaryWallet?.connector as StarknetWalletConnectorType;
        
    if(!connector) return;
    
    const message = 'Hello World';

    const signature = await connector.signMessage(message);
    console.log(signature)
  }
  return (
    <button onClick={() => signMessage()}>
      Yes
    </button>
  )
}



export default Predict;


