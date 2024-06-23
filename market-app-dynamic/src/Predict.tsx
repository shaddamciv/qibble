import React from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import { constants } from 'starknet';
import { WalletClient, Transport } from 'viem';

const Predict = () => {
  const { primaryWallet } = useDynamicContext();

  const signMessage = async () => {
    if (!primaryWallet) return;

    const connector = primaryWallet?.connector as StarknetWalletConnectorType;
        
    if(!connector) return;

    const testAddress = '0x00224c79bfde3c5ef6d1d97fc0a5a576c640db494d766fd9b92be13d9dec711b';
    const signer = await primaryWallet.connector.getSigner()
    console.log(signer)  // read abi of Test contract
    
    const { abi: testAbi } = await signer.getClassAt(testAddress);
    if (testAbi === undefined) {
    throw new Error('no abi.');
    }
    const providerAlchemyTestnet = new RpcProvider({
      nodeUrl: 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/qgByQi8LcnyQxpCzCr2OfhWx89mZo3an',
    });
if (!providerAlchemyTestnet) return;
signer.provider = providerAlchemyTestnet;
    const account0 = new Account(signer.provider, primaryWallet.address, signer.signer);
    console.log("Generating account...", account0)

    const myTestContract = new Contract(testAbi, testAddress, providerAlchemyTestnet);
    const bal1 = await myTestContract.get_market_info(1);
    console.log('In Predict balance =', bal1);

    myTestContract.connect(account0);
    const myCall = myTestContract.populate('place_bet', [
      "0x01",
      "0x01",
      "0x01"
    ]);
    const res = await myTestContract.place_bet(myCall.calldata, { maxFee: 900_000_000_000_000 });
    await signer.waitForTransaction(res.transaction_hash);

    
    // const message = 'Hello World';

    // const signature = await connector.signMessage(message);
    // console.log(signature)
  }
  return (
    <button onClick={() => signMessage()}>
      Yes
    </button>
  )
}



export default Predict;


