import React from 'react';
import { Chain, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import { constants } from 'starknet';
import { WalletClient, Transport } from 'viem';

function Balance() {
    const { primaryWallet } = useDynamicContext();
    const [balance, setBalance] = React.useState(null);

    React.useEffect(() => {
        const fetchBalance = async () => {
          if (primaryWallet) {
            const value = await primaryWallet.connector.getBalance();
            setBalance(value);
            //get the provider
            const providerAlchemyTestnet = new RpcProvider({
                nodeUrl: 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/qgByQi8LcnyQxpCzCr2OfhWx89mZo3an',
              });
          if (!providerAlchemyTestnet) return;
          const testAddress = '0x00224c79bfde3c5ef6d1d97fc0a5a576c640db494d766fd9b92be13d9dec711b';
          console.log(providerAlchemyTestnet)
          // read abi of Test contract
          const { abi: testAbi } = await providerAlchemyTestnet.getClassAt(testAddress);
          if (testAbi === undefined) {
            throw new Error('no abi.');
          }
          const myTestContract = new Contract(testAbi, testAddress, providerAlchemyTestnet);

          // Interaction with the contract with call
          const bal1 = await myTestContract.get_market_info(1);
          console.log('Initial balance =', bal1);
          }
          
        };
        fetchBalance();
      }, [primaryWallet]);


      if (primaryWallet) {
        return (
          <div>
            <p>User is logged in</p>
            <p>Address: {primaryWallet.address}</p>
            <p>Balance: {balance}</p>
          </div>
        );
    }

}


export default Balance;


