import { Link } from '@tanstack/react-router';
import { Gamepad2, Wallet, TrendingUp, Shield, Zap, Trophy } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-gradient glow animate-pulse-slow">
            WIN BIG WITH HUMBO BUMBO!
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-semibold">
            Play exciting games, place your bets, and win real money! 🎮💰
          </p>
          {identity ? (
            <Link
              to="/games"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-xl font-bold hover:shadow-glow-lg transition-all transform hover:scale-105"
            >
              <Gamepad2 className="w-6 h-6" />
              Start Playing Now
            </Link>
          ) : (
            <button
              onClick={login}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-xl font-bold hover:shadow-glow-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              <Zap className="w-6 h-6" />
              {isLoggingIn ? 'Connecting...' : 'Get Started'}
            </button>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gradient">
          Why Choose Humbo Bumbo?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Gamepad2 className="w-12 h-12 text-primary" />}
            title="Exciting Games"
            description="Play thrilling games with simple mechanics and big winning potential"
          />
          <FeatureCard
            icon={<Wallet className="w-12 h-12 text-secondary" />}
            title="Easy Wallet"
            description="Deposit, withdraw, and manage your funds with ease"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-accent" />}
            title="Big Wins"
            description="Win up to 2x your bet amount on every game you play"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-warning" />}
            title="Secure Platform"
            description="Built on Internet Computer for maximum security and transparency"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-destructive" />}
            title="Instant Results"
            description="Get your winnings credited immediately after each game"
          />
          <FeatureCard
            icon={<Trophy className="w-12 h-12 text-success" />}
            title="Track History"
            description="View all your past games and track your winning streak"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient">
          Ready to Win?
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Join thousands of players winning real money every day!
        </p>
        {identity ? (
          <Link
            to="/games"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-2xl text-xl font-bold hover:shadow-glow transition-all transform hover:scale-105"
          >
            <Trophy className="w-6 h-6" />
            Browse Games
          </Link>
        ) : (
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-2xl text-xl font-bold hover:shadow-glow transition-all transform hover:scale-105 disabled:opacity-50"
          >
            Login to Play
          </button>
        )}
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-glow transition-all transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
