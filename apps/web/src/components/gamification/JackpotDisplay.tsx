'use client';

interface JackpotDisplayProps {
  amount: string;
  currency?: string;
  animate?: boolean;
}

export function JackpotDisplay({ amount, currency = 'Ξ', animate = true }: JackpotDisplayProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-4xl">🏆</span>
        <h2 className="text-2xl font-display text-gold-500">Golden Fleece Jackpot</h2>
      </div>
      <div className={`jackpot-amount text-6xl md:text-8xl font-bold mb-4 ${animate ? 'animate-pulse' : ''}`}>
        {currency} {amount}
      </div>
      <p className="text-marble-400">
        Progressive jackpot • Any bet could win
      </p>
    </div>
  );
}

interface JackpotCardProps {
  amount: string;
  currency?: string;
  lastWinner?: {
    username: string;
    amount: string;
    date: Date;
  };
}

export function JackpotCard({ amount, currency = 'Ξ', lastWinner }: JackpotCardProps) {
  return (
    <div className="card-marble p-8 border border-gold-600/30 border-glow-gold">
      <JackpotDisplay amount={amount} currency={currency} />
      
      {lastWinner && (
        <div className="mt-6 pt-6 border-t border-gold-600/20">
          <p className="text-sm text-marble-400 text-center">
            Last winner: <span className="text-gold-500">{lastWinner.username}</span> won{' '}
            <span className="text-gold-500">{currency} {lastWinner.amount}</span>
          </p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button className="btn-gold">Play Now</button>
      </div>
    </div>
  );
}

interface JackpotContributionProps {
  betAmount: string;
  contributionAmount: string;
  currency?: string;
}

export function JackpotContribution({ betAmount, contributionAmount, currency = 'Ξ' }: JackpotContributionProps) {
  return (
    <div className="text-xs text-marble-500 flex items-center gap-2">
      <span>🐏</span>
      <span>
        {currency} {contributionAmount} contributed to Golden Fleece
      </span>
    </div>
  );
}
