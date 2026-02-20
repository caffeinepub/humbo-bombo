import { History as HistoryIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useGameHistory } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function GameHistory() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: history, isLoading } = useGameHistory();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-display font-bold mb-6 text-gradient">Login to View History</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect your wallet to see your game history!
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground mt-4">Loading history...</p>
      </div>
    );
  }

  const filteredHistory = history?.filter(bet => bet.outcome !== 'pending') || [];
  const totalWins = filteredHistory.filter(bet => bet.outcome === 'win').length;
  const totalLosses = filteredHistory.filter(bet => bet.outcome === 'loss').length;
  const totalWinnings = filteredHistory.reduce((sum, bet) => sum + Number(bet.winnings), 0);
  const totalBet = filteredHistory.reduce((sum, bet) => sum + Number(bet.betAmount), 0);
  const netProfit = totalWinnings - totalBet;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient glow">
          Game History
        </h1>
        <p className="text-xl text-muted-foreground">Track your wins and losses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
        <StatCard
          label="Total Games"
          value={filteredHistory.length}
          icon={<HistoryIcon className="w-6 h-6" />}
          color="text-primary"
        />
        <StatCard
          label="Wins"
          value={totalWins}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-success"
        />
        <StatCard
          label="Losses"
          value={totalLosses}
          icon={<TrendingDown className="w-6 h-6" />}
          color="text-destructive"
        />
        <StatCard
          label="Net Profit"
          value={`₹${netProfit.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color={netProfit >= 0 ? 'text-success' : 'text-destructive'}
        />
      </div>

      {/* History List */}
      <div className="max-w-4xl mx-auto">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Games Played Yet</h3>
            <p className="text-muted-foreground">Start playing to see your history here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((bet, index) => (
              <HistoryEntry key={index} bet={bet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function HistoryEntry({ bet }: { bet: { gameName: string; betAmount: bigint; winnings: bigint; outcome: string } }) {
  const isWin = bet.outcome === 'win';
  const netAmount = Number(bet.winnings) - Number(bet.betAmount);

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-glow transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 capitalize">
            {bet.gameName.replace('-', ' ')}
          </h3>
          <p className="text-sm text-muted-foreground">
            Bet: ₹{Number(bet.betAmount).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${isWin ? 'text-success' : 'text-destructive'}`}>
            {isWin ? '+' : ''}₹{netAmount.toLocaleString()}
          </div>
          <div className={`text-sm font-semibold ${isWin ? 'text-success' : 'text-destructive'}`}>
            {isWin ? 'WIN' : 'LOSS'}
          </div>
        </div>
      </div>
    </div>
  );
}
