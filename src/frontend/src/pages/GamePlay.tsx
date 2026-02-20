import { useParams, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Dices } from 'lucide-react';
import { useBalance, usePlaceBet, useResolveBet } from '../hooks/useQueries';
import BetPlacement from '../components/BetPlacement';
import GameResult from '../components/GameResult';

type GameState = 'betting' | 'playing' | 'result';

export default function GamePlay() {
  const { gameName } = useParams({ from: '/play/$gameName' });
  const navigate = useNavigate();
  const { data: balance } = useBalance();
  const placeBetMutation = usePlaceBet();
  const resolveBetMutation = useResolveBet();

  const [gameState, setGameState] = useState<GameState>('betting');
  const [betAmount, setBetAmount] = useState<bigint>(BigInt(0));
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [winnings, setWinnings] = useState<bigint>(BigInt(0));

  const handleBetPlaced = async (amount: bigint) => {
    try {
      await placeBetMutation.mutateAsync({ gameName, betAmount: amount });
      setBetAmount(amount);
      setGameState('playing');
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };

  const handleNumberSelect = async (number: number) => {
    setSelectedNumber(number);
    
    // Generate lucky number
    const lucky = Math.floor(Math.random() * 10) + 1;
    setLuckyNumber(lucky);

    // Determine win/loss
    const won = number === lucky;
    setIsWin(won);
    
    const prize = won ? betAmount * BigInt(2) : BigInt(0);
    setWinnings(prize);

    // Resolve bet in backend
    try {
      await resolveBetMutation.mutateAsync({
        gameName,
        outcome: won ? 'win' : 'loss',
        winnings: prize,
      });
      setGameState('result');
    } catch (error) {
      console.error('Failed to resolve bet:', error);
    }
  };

  const handlePlayAgain = () => {
    setGameState('betting');
    setSelectedNumber(null);
    setLuckyNumber(null);
    setIsWin(false);
    setWinnings(BigInt(0));
    setBetAmount(BigInt(0));
  };

  return (
    <div 
      className="min-h-[calc(100vh-5rem)] relative"
      style={{
        backgroundImage: 'url(/assets/generated/game-background.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <div className="relative container mx-auto px-4 py-12">
        <button
          onClick={() => navigate({ to: '/games' })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold mb-2 text-gradient glow">
              {gameName === 'lucky-number' ? 'Lucky Number' : 
               gameName === 'quick-pick' ? 'Quick Pick' : 'Lightning Round'}
            </h1>
            <p className="text-muted-foreground">
              Balance: <span className="font-bold text-accent">₹{balance ? Number(balance).toLocaleString() : '0'}</span>
            </p>
          </div>

          {gameState === 'betting' && (
            <BetPlacement
              minBet={10}
              maxBet={1000}
              balance={balance || BigInt(0)}
              onBetPlaced={handleBetPlaced}
              isLoading={placeBetMutation.isPending}
            />
          )}

          {gameState === 'playing' && (
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="text-center mb-8">
                <Dices className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                <h2 className="text-2xl font-display font-bold mb-2">Pick Your Lucky Number</h2>
                <p className="text-muted-foreground">Choose a number between 1 and 10</p>
                <p className="text-sm text-accent mt-2">Bet Amount: ₹{Number(betAmount)}</p>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberSelect(num)}
                    disabled={selectedNumber !== null}
                    className="aspect-square bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-xl text-2xl font-bold hover:shadow-glow transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'result' && (
            <GameResult
              isWin={isWin}
              winnings={winnings}
              betAmount={betAmount}
              selectedNumber={selectedNumber!}
              luckyNumber={luckyNumber!}
              onPlayAgain={handlePlayAgain}
              onBackToGames={() => navigate({ to: '/games' })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
