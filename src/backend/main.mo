import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  type BetOutcome = {
    gameName : Text;
    betAmount : Nat;
    winnings : Nat;
    outcome : Text;
  };

  module BetOutcome {
    public func compare(bet1 : BetOutcome, bet2 : BetOutcome) : Order.Order {
      Nat.compare(bet1.betAmount, bet2.betAmount);
    };
  };

  type Wallet = {
    balance : Nat;
    bets : List.List<BetOutcome>;
  };

  let wallets = Map.empty<Principal, Wallet>();

  public shared ({ caller }) func createWallet() : async () {
    if (wallets.containsKey(caller)) {
      Runtime.trap("Caller already has a wallet. ");
    };
    let wallet : Wallet = {
      balance = 0;
      bets = List.empty<BetOutcome>();
    };
    wallets.add(caller, wallet);
  };

  func getWallet(user : Principal) : Wallet {
    switch (wallets.get(user)) {
      case (null) { Runtime.trap("Wallet does not exist. ") };
      case (?wallet) { wallet };
    };
  };

  public shared ({ caller }) func deposit(amount : Nat) : async () {
    if (amount == 0) {
      Runtime.trap("Deposit amount must not be zero. ");
    };
    let oldWallet = getWallet(caller);
    let newWallet = {
      oldWallet with
      balance = oldWallet.balance + amount;
    };
    wallets.add(caller, newWallet);
  };

  public shared ({ caller }) func withdraw(amount : Nat) : async () {
    let oldWallet = getWallet(caller);
    if (oldWallet.balance < amount) {
      Runtime.trap("Insufficient funds. ");
    };
    let newWallet = {
      oldWallet with
      balance = oldWallet.balance - amount;
    };
    wallets.add(caller, newWallet);
  };

  public shared ({ caller }) func placeBet(gameName : Text, betAmount : Nat) : async () {
    let oldWallet = getWallet(caller);
    if (betAmount > oldWallet.balance) {
      Runtime.trap("Insufficient balance for bet. ");
    };
    let newBalance = oldWallet.balance - betAmount;
    let bet : BetOutcome = {
      gameName;
      betAmount;
      winnings = 0;
      outcome = "pending";
    };
    let newBets = oldWallet.bets.clone();
    newBets.add(bet);

    let newWallet = {
      oldWallet with
      balance = newBalance;
      bets = newBets;
    };
    wallets.add(caller, newWallet);
  };

  public shared ({ caller }) func resolveBet(gameName : Text, outcome : Text, winnings : Nat) : async () {
    let oldWallet = getWallet(caller);
    let bet = oldWallet.bets.find(func(b) { b.gameName == gameName and b.outcome == "pending" });
    let betOutcome = switch (bet) {
      case (null) { Runtime.trap("No pending bet for this game. ") };
      case (?outcome) { outcome };
    };

    let updatedBet = {
      betOutcome with
      winnings;
      outcome;
    };
    let newBets = oldWallet.bets.clone();
    newBets.add(updatedBet);
    let newWallet = {
      oldWallet with
      balance = oldWallet.balance + winnings;
      bets = newBets;
    };
    wallets.add(caller, newWallet);
  };

  public query ({ caller }) func getBalance() : async Nat {
    getWallet(caller).balance;
  };

  public query ({ caller }) func getGameHistory() : async [BetOutcome] {
    getWallet(caller).bets.toArray().sort();
  };
};
