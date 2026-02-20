import { Trophy, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface GameResultProps {
  isWin: boolean;
  winnings: bigint;
  betAmount: bigint;
  selectedNumber: number;
  luckyNumber: number;
  onPlayAgain: () => void;
  onBackToGames: () => void;
}

export default function GameResult({
  isWin,
  winnings,
  betAmount,
  selectedNumber,
  luckyNumber,
  onPlayAgain,
  onBackToGames,
}: GameResultProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 text-center">
      <div className="mb-6">
        {isWin ? (
          <Trophy className="w-24 h-24 mx-auto text-success animate-pulse" />
        ) : (
          <XCircle className="w-24 h-24 mx-auto text-destructive" />
        )}
      </div>

      <h2 className={`text-4xl font-display font-bold mb-4 ${isWin ? 'text-success' : 'text-destructive'}`}>
        {isWin ? 'YOU WIN!' : 'YOU LOSE!'}
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Your Number</div>
          <div className="text-3xl font-bold">{selectedNumber}</div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Lucky Number</div>
          <div className="text-3xl font-bold text-primary">{luckyNumber}</div>
        </div>

        <div className={`rounded-xl p-4 ${isWin ? 'bg-success/20 border border-success' : 'bg-destructive/20 border border-destructive'}`}>
          <div className="text-sm mb-1">
            {isWin ? 'You Won' : 'You Lost'}
          </div>
          <div className={`text-4xl font-bold ${isWin ? 'text-success' : 'text-destructive'}`}>
            {isWin ? '+' : '-'}₹{Number(isWin ? winnings : betAmount).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-glow transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
        <button
          onClick={onBackToGames}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          All Games
        </button>
      </div>
    </div>
  );
}
