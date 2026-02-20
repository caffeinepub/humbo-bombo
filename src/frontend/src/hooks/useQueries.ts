import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BetOutcome } from '../backend';

export function useBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      try {
        return await actor.getBalance();
      } catch (error) {
        // Wallet doesn't exist yet
        return BigInt(0);
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createWallet();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deposit(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useWithdraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.withdraw(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function usePlaceBet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameName, betAmount }: { gameName: string; betAmount: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.placeBet(gameName, betAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useResolveBet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameName, outcome, winnings }: { gameName: string; outcome: string; winnings: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.resolveBet(gameName, outcome, winnings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['gameHistory'] });
    },
  });
}

export function useGameHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<BetOutcome[]>({
    queryKey: ['gameHistory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getGameHistory();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
