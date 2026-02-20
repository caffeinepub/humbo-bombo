import { Link, useRouterState } from '@tanstack/react-router';
import { Wallet, History, Gamepad2, Home, Menu, X } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBalance } from '../hooks/useQueries';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: balance } = useBalance();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/assets/generated/humbo-bumbo-logo.dim_256x256.png" 
                alt="Humbo Bumbo" 
                className="h-12 w-12 transition-transform group-hover:scale-110"
              />
              <h1 className="text-2xl md:text-3xl font-display font-black text-gradient glow">
                HUMBO BUMBO
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive(path)
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {identity ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent rounded-lg">
                    <Wallet className="w-4 h-4 text-accent" />
                    <span className="font-bold text-accent">
                      ₹{balance ? Number(balance).toLocaleString() : '0'}
                    </span>
                  </div>
                  <button
                    onClick={clear}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  disabled={isLoggingIn}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {isLoggingIn ? 'Connecting...' : 'Login'}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/50">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive(path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              {identity && (
                <div className="flex items-center gap-2 px-4 py-3 mt-2 bg-accent/20 border border-accent rounded-lg">
                  <Wallet className="w-5 h-5 text-accent" />
                  <span className="font-bold text-accent">
                    Balance: ₹{balance ? Number(balance).toLocaleString() : '0'}
                  </span>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Humbo Bumbo. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
