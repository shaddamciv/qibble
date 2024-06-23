import React from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from '@dynamic-labs/starknet';

function SignMessage() {
    const { primaryWallet } = useDynamicContext();
 
    const handleSignMessage = async () => {
        if(!primaryWallet) return;

        const connector = primaryWallet?.connector as StarknetWalletConnectorType;
        
        if(!connector) return;
        
        const message = 'Hello World';

        const signature = await connector.signMessage(message);
        console.log(signature)
    }


    return <div>
    <button onClick={() => handleSignMessage()}>Sign Message</button>
    </div>;

}

export default SignMessage;