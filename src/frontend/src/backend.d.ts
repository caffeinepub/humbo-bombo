import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BetOutcome {
    betAmount: bigint;
    winnings: bigint;
    gameName: string;
    outcome: string;
}
export interface backendInterface {
    createWallet(): Promise<void>;
    deposit(amount: bigint): Promise<void>;
    getBalance(): Promise<bigint>;
    getGameHistory(): Promise<Array<BetOutcome>>;
    placeBet(gameName: string, betAmount: bigint): Promise<void>;
    resolveBet(gameName: string, outcome: string, winnings: bigint): Promise<void>;
    withdraw(amount: bigint): Promise<void>;
}
