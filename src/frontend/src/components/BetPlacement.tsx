import { useState } from 'react';
import { Coins } from 'lucide-react';

interface BetPlacementProps {
  minBet: number;
  maxBet: number;
  balance: bigint;
  onBetPlaced: (amount: bigint) => void;
  isLoading: boolean;
}

export default function BetPlacement({ minBet, maxBet, balance, onBetPlaced, isLoading }: BetPlacementProps) {
  const [betAmount, setBetAmount] = useState('');
  const [error, setError] = useState('');

  const handleBet = () => {
    setError('');
    const amount = Number(betAmount);

    if (!betAmount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < minBet) {
      setError(`Minimum bet is ₹${minBet}`);
      return;
    }

    if (amount > maxBet) {
      setError(`Maximum bet is ₹${maxBet}`);
      return;
    }

    if (BigInt(amount) > balance) {
      setError('Insufficient balance');
      return;
    }

    onBetPlaced(BigInt(amount));
  };

  const quickBets = [minBet, minBet * 5, minBet * 10, minBet * 20].filter(amt => amt <= maxBet);

  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <div className="text-center mb-8">
        <Coins className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
        <h2 className="text-2xl font-display font-bold mb-2">Place Your Bet</h2>
        <p className="text-muted-foreground">
          Min: ₹{minBet} | Max: ₹{maxBet}
        </p>
        <p className="text-sm text-accent mt-2">
          Your Balance: ₹{Number(balance).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Enter bet amount"
            className="w-full px-4 py-4 bg-background border border-input rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-3 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {quickBets.map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount.toString())}
              className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg font-semibold transition-colors"
            >
              ₹{amount}
            </button>
          ))}
        </div>

        <button
          onClick={handleBet}
          disabled={isLoading}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-xl font-bold hover:shadow-glow transition-all disabled:opacity-50"
        >
          {isLoading ? 'Placing Bet...' : 'Confirm Bet'}
        </button>
      </div>
    </div>
  );
}
