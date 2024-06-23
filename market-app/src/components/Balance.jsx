// import { useEffect, useState } from "react";

// import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

// export const Balance = () => {
//   const {
//     handleLogOut,
//     setShowAuthFlow,
//     showAuthFlow,
//     primaryWallet
//   } = useDynamicContext();

//   const [balance, setBalance] = useState(null);

//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (primaryWallet) {
//         const value = await primaryWallet.connector.getBalance();
//         setBalance(value);
//       }
//     };
//     fetchBalance();
//   }, [primaryWallet]);

//   if (primaryWallet && !showAuthFlow) {
//     return (
//       <div>
//         <p>User is logged in</p>
//         <p>Address: {primaryWallet.address}</p>
//         <p>Balance: {balance}</p>
       
//       </div>
//     );
//   }
// };




