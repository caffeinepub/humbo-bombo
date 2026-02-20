import { useNavigate } from '@tanstack/react-router';
import { Dices, Target, Zap } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBalance } from '../hooks/useQueries';

interface Game {
  id: string;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
  multiplier: number;
  icon: React.ReactNode;
  color: string;
}

const GAMES: Game[] = [
  {
    id: 'lucky-number',
    name: 'Lucky Number',
    description: 'Guess the lucky number between 1-10 and win 2x your bet!',
    minBet: 10,
    maxBet: 1000,
    multiplier: 2,
    icon: <Dices className="w-12 h-12" />,
    color: 'from-primary to-secondary',
  },
  {
    id: 'quick-pick',
    name: 'Quick Pick',
    description: 'Pick the winning option and double your money instantly!',
    minBet: 20,
    maxBet: 2000,
    multiplier: 2,
    icon: <Target className="w-12 h-12" />,
    color: 'from-secondary to-accent',
  },
  {
    id: 'lightning-round',
    name: 'Lightning Round',
    description: 'Fast-paced action! Win big in seconds!',
    minBet: 50,
    maxBet: 5000,
    multiplier: 2,
    icon: <Zap className="w-12 h-12" />,
    color: 'from-accent to-warning',
  },
];

export default function GameSelection() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: balance } = useBalance();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-display font-bold mb-6 text-gradient">Login to Play Games</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect your wallet to start playing and winning!
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
          Choose Your Game
        </h1>
        <p className="text-xl text-muted-foreground">
          Your Balance: <span className="font-bold text-accent">₹{balance ? Number(balance).toLocaleString() : '0'}</span>
        </p>
        {balance === BigInt(0) && (
          <p className="text-warning mt-2">
            <button 
              onClick={() => navigate({ to: '/wallet' })}
              className="underline font-semibold hover:text-warning/80"
            >
              Add funds to your wallet
            </button>{' '}
            to start playing!
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} balance={balance || BigInt(0)} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

function GameCard({ game, balance, navigate }: { game: Game; balance: bigint; navigate: ReturnType<typeof useNavigate> }) {
  const canPlay = balance >= BigInt(game.minBet);

  const handlePlayClick = () => {
    navigate({ to: '/play/$gameName', params: { gameName: game.id } });
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-glow transition-all transform hover:scale-105">
      <div className={`bg-gradient-to-br ${game.color} p-8 text-white`}>
        <div className="flex justify-center mb-4">{game.icon}</div>
        <h3 className="text-2xl font-display font-bold text-center">{game.name}</h3>
      </div>
      <div className="p-6">
        <p className="text-muted-foreground mb-4">{game.description}</p>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Min Bet:</span>
            <span className="font-bold">₹{game.minBet}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Max Bet:</span>
            <span className="font-bold">₹{game.maxBet}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Win Multiplier:</span>
            <span className="font-bold text-accent">{game.multiplier}x</span>
          </div>
        </div>
        {canPlay ? (
          <button
            onClick={handlePlayClick}
            className="block w-full py-3 bg-primary text-primary-foreground rounded-xl text-center font-bold hover:shadow-glow transition-all"
          >
            Play Now
          </button>
        ) : (
          <button
            disabled
            className="block w-full py-3 bg-muted text-muted-foreground rounded-xl text-center font-bold cursor-not-allowed"
          >
            Insufficient Balance
          </button>
        )}
      </div>
    </div>
  );
}
