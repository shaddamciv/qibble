#[starknet::contract]
mod PredictionMarket {
    use starknet::ContractAddress;
    use starknet::class_hash::ClassHash;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use core::option::OptionTrait;

    // Import the IERC20 interface
    use openzeppelin::token::erc20::dual20::{DualCaseERC20, DualCaseERC20Trait};

    #[storage]
    struct Storage {
        markets: LegacyMap<u32, Market>,
        market_count: u32,
        bets: LegacyMap<(u32, ContractAddress), u256>,
        market_outcomes: LegacyMap<u32, Option<bool>>,
        stark_token: ContractAddress,
        withdrawn: LegacyMap<(u32, ContractAddress), bool>,
    }

    #[derive(Drop, Copy, Serde, starknet::Store)]
    struct Market {
        creator: ContractAddress,
        description: felt252,
        end_time: u64,
        total_bets_yes: u256,
        total_bets_no: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        MarketCreated: MarketCreated,
        BetPlaced: BetPlaced,
        MarketResolved: MarketResolved,
        WinningsWithdrawn: WinningsWithdrawn,
    }

    #[derive(Drop, starknet::Event)]
    struct MarketCreated {
        market_id: u32,
        creator: ContractAddress,
        description: felt252,
        end_time: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct BetPlaced {
        market_id: u32,
        bettor: ContractAddress,
        amount: u256,
        bet_yes: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct MarketResolved {
        market_id: u32,
        outcome: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct WinningsWithdrawn {
        market_id: u32,
        bettor: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, stark_token_address: ContractAddress) {
        self.stark_token.write(stark_token_address);
    }

    #[external(v0)]
    fn create_market(ref self: ContractState, description: felt252, end_time: u64) -> u32 {
        let caller = get_caller_address();
        let market_id = self.market_count.read() + 1;
        
        self.markets.write(market_id, Market {
            creator: caller,
            description: description,
            end_time: end_time,
            total_bets_yes: 0_u256,
            total_bets_no: 0_u256,
        });

        self.market_count.write(market_id);

        self.emit(MarketCreated {
            market_id: market_id,
            creator: caller,
            description: description,
            end_time: end_time,
        });

        market_id
    }

    #[external(v0)]
    fn place_bet(ref self: ContractState, market_id: u32, bet_yes: bool, amount: u256) {
        let caller = get_caller_address();
        let mut market = self.markets.read(market_id);
        assert(market.end_time > get_block_timestamp(), 'Market has ended');

        // Transfer Stark tokens from the bettor to this contract
        let stark_token = DualCaseERC20 { contract_address: self.stark_token.read() };
        stark_token.transfer_from(caller, starknet::get_contract_address(), amount);
    
        if bet_yes {
            market.total_bets_yes += amount;
        } else {
            market.total_bets_no += amount;
        }

        self.markets.write(market_id, market);
        self.bets.write((market_id, caller), amount);

        self.emit(Event::BetPlaced(BetPlaced {
            market_id: market_id,
            bettor: caller,
            amount: amount,
            bet_yes: bet_yes,
        }));
    }

    #[external(v0)]
    fn resolve_market(ref self: ContractState, market_id: u32, outcome: bool) {
        let market = self.markets.read(market_id);
        assert(get_caller_address() == market.creator, 'Only creator can resolve');
        assert(market.end_time <= starknet::get_block_timestamp(), 'Market not ended yet');
        assert(self.market_outcomes.read(market_id).is_none(), 'Already resolved');

        self.market_outcomes.write(market_id, Option::Some(outcome));

        self.emit(MarketResolved {
            market_id: market_id,
            outcome: outcome,
        });
    }

    #[external(v0)]
    fn get_market_info(self: @ContractState, market_id: u32) -> Market {
        self.markets.read(market_id)
    }

    #[external(v0)]
    fn get_bet(self: @ContractState, market_id: u32, bettor: ContractAddress) -> u256 {
        self.bets.read((market_id, bettor))
    }

    #[external(v0)]
    fn get_market_outcome(self: @ContractState, market_id: u32) -> Option<bool> {
        self.market_outcomes.read(market_id)
    }

    #[external(v0)]
    fn withdraw_winnings(ref self: ContractState, market_id: u32) {
        let caller = get_caller_address();
        let market = self.markets.read(market_id);
        let outcome = self.market_outcomes.read(market_id);
        
        assert(outcome.is_some(), 'Market not resolved');
        assert(!self.withdrawn.read((market_id, caller)), 'Already withdrawn');

        let bet_amount = self.bets.read((market_id, caller));
        assert(bet_amount > 0, 'No bet placed');

        let bet_outcome = outcome.unwrap();
        let total_bets = market.total_bets_yes + market.total_bets_no;
        let winning_pool = if bet_outcome { market.total_bets_yes } else { market.total_bets_no };

        let winnings = if (bet_outcome && self.bets.read((market_id, caller)) > 0) || 
                          (!bet_outcome && self.bets.read((market_id, caller)) == 0) {
            (bet_amount * total_bets) / winning_pool
        } else {
            0
        };

        assert(winnings > 0, 'No winnings to withdraw');

        // Mark as withdrawn
        self.withdrawn.write((market_id, caller), true);

        // Get the winnings
        let stark_token = DualCaseERC20 { contract_address: self.stark_token.read() };
        stark_token.transfer(caller, winnings);
    
        self.emit(Event::WinningsWithdrawn(WinningsWithdrawn {
            market_id: market_id,
            bettor: caller,
            amount: winnings,
        }));
    }
}