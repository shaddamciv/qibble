## Introduction

This was made for the StarkHack 2024 event, it is a basic prediction market concept. 
It uses dynamic for login and onboarding. It relies on STARK tokens for collateral and winnings.

#### TODO
- Migrate to Gnosis Conditional Token Framework for a more expressive prediction market language
- Create an AI powered Oracle to resolve markets instead of human resolution

## How It Works

#### Market Creation

Any user can create a new prediction market by specifying a description and an end time.
Each market is assigned a unique ID.


#### Placing Bets

Users can place bets on markets before they end.
Bets are made using Stark tokens, which are transferred to the contract.
Users can bet either "Yes" or "No" on the market outcome.


#### Market Resolution

Once a market's end time is reached, only the market creator can resolve it.
The creator sets the final outcome (True or False).


#### Withdrawing Winnings

After a market is resolved, winning bettors can withdraw their winnings.
Winnings are calculated based on the total bets and the user's contribution to the winning pool.
Stark tokens are transferred to winners upon withdrawal.


### Features

Uses ERC20 tokens for bets and rewards.
Prevents double withdrawals and ensures markets can't be resolved twice.
Allows querying of market information, individual bets, and outcomes.


### Events

The contract emits events for market creation, bet placement, market resolution, and winnings withdrawal.


To interact with this contract, users need to:

Have Stark tokens approved for use by this contract.
On testnet goto -> https://sepolia.voyager.online/contract/0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d#writeContract

Create markets or participate in existing ones before their end time.
Wait for market resolution after the end time.
Withdraw winnings if their prediction was correct.