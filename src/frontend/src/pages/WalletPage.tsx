import { useState } from 'react';
import { Wallet, Plus, Minus, AlertCircle } from 'lucide-react';
import { useBalance, useDeposit, useWithdraw, useCreateWallet } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function WalletPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: balance, isLoading } = useBalance();
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();
  const createWalletMutation = useCreateWallet();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');

  const needsWallet = balance === BigInt(0) && !isLoading;

  const handleCreateWallet = async () => {
    try {
      setError('');
      await createWalletMutation.mutateAsync();
    } catch (err: any) {
      if (!err.message?.includes('already has a wallet')) {
        setError(err.message || 'Failed to create wallet');
      }
    }
  };

  const handleDeposit = async () => {
    try {
      setError('');
      const amount = BigInt(depositAmount);
      if (amount <= 0) {
        setError('Amount must be greater than 0');
        return;
      }
      await depositMutation.mutateAsync(amount);
      setDepositAmount('');
    } catch (err: any) {
      if (err.message?.includes('does not exist')) {
        await handleCreateWallet();
        await depositMutation.mutateAsync(BigInt(depositAmount));
        setDepositAmount('');
      } else {
        setError(err.message || 'Failed to deposit');
      }
    }
  };

  const handleWithdraw = async () => {
    try {
      setError('');
      const amount = BigInt(withdrawAmount);
      if (amount <= 0) {
        setError('Amount must be greater than 0');
        return;
      }
      if (amount > (balance || BigInt(0))) {
        setError('Insufficient balance');
        return;
      }
      await withdrawMutation.mutateAsync(amount);
      setWithdrawAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-display font-bold mb-6 text-gradient">Login to Access Wallet</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect your wallet to manage your funds!
        </p>
        <button
          onClick={login}
          disabled={isLoggingIn}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-xl font-bold hover:shadow-glow transition-all disabled:opacity-50"
        >
          {isLoggingIn ? 'Connecting...' : 'Login Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient glow">
          Your Wallet
        </h1>
        <p className="text-xl text-muted-foreground">Manage your funds</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 rounded-2xl p-8 text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-primary" />
          <div className="text-sm text-muted-foreground mb-2">Current Balance</div>
          <div className="text-5xl font-display font-bold text-gradient glow">
            ₹{balance ? Number(balance).toLocaleString() : '0'}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Deposit Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-success/20 rounded-lg">
              <Plus className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold">Deposit Funds</h2>
          </div>
          <p className="text-muted-foreground mb-4">Add money to your wallet to start playing</p>
          <div className="flex gap-3">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleDeposit}
              disabled={depositMutation.isPending || !depositAmount}
              className="px-6 py-3 bg-success text-success-foreground rounded-xl font-bold hover:shadow-glow transition-all disabled:opacity-50"
            >
              {depositMutation.isPending ? 'Processing...' : 'Deposit'}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {[100, 500, 1000, 5000].map((amount) => (
              <button
                key={amount}
                onClick={() => setDepositAmount(amount.toString())}
                className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-semibold transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-warning/20 rounded-lg">
              <Minus className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-2xl font-display font-bold">Withdraw Funds</h2>
          </div>
          <p className="text-muted-foreground mb-4">Transfer money from your wallet</p>
          <div className="flex gap-3">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending || !withdrawAmount}
              className="px-6 py-3 bg-warning text-warning-foreground rounded-xl font-bold hover:shadow-glow transition-all disabled:opacity-50"
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 border border-border rounded-xl p-6">
          <h3 className="font-bold mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Deposit funds to start playing games</li>
            <li>• Minimum bet varies by game</li>
            <li>• Winnings are credited instantly</li>
            <li>• Withdraw anytime with no fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
