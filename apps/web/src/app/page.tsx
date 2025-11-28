export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-gold-gradient">Ascend to</span>
            <br />
            <span className="text-marble-100">Mount Olympus</span>
          </h1>
          <p className="text-xl text-marble-400 mb-8 font-body">
            Where mortals become gods. Experience the ultimate crypto casino
            with provably fair games, epic rewards, and legendary jackpots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-gold text-lg">
              ⚡ Start Your Odyssey
            </button>
            <button className="px-6 py-3 rounded-lg border border-gold-600 text-gold-500 hover:bg-gold-600/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Golden Fleece Jackpot */}
      <section className="mb-16">
        <div className="card-marble p-8 text-center border border-gold-600/30 border-glow-gold">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">🏆</span>
            <h2 className="text-2xl font-display text-gold-500">Golden Fleece Jackpot</h2>
          </div>
          <div className="jackpot-amount text-6xl md:text-8xl font-bold mb-4">
            Ξ 127.43
          </div>
          <p className="text-marble-400 mb-4">Progressive jackpot • Any bet could win</p>
          <button className="btn-gold">Play Now</button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-display text-center mb-12 text-gold-gradient">
          Divine Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* The Odyssey */}
          <div className="card-marble p-6 border border-gold-600/20 hover:border-gold-600/40 transition-colors">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-display text-gold-500 mb-2">The Odyssey</h3>
            <p className="text-marble-400 text-sm">
              Earn Ambrosia (XP) and rise through the ranks from Mortal to God.
              Unlock exclusive rewards and multipliers.
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="badge-mortal text-xs">Mortal</span>
              <span className="badge-hero text-xs">Hero</span>
              <span className="badge-titan text-xs">Titan</span>
              <span className="badge-god text-xs">God</span>
            </div>
          </div>

          {/* Golden Fleece */}
          <div className="card-marble p-6 border border-gold-600/20 hover:border-gold-600/40 transition-colors">
            <div className="text-4xl mb-4">🐏</div>
            <h3 className="text-xl font-display text-gold-500 mb-2">Golden Fleece</h3>
            <p className="text-marble-400 text-sm">
              Global progressive jackpot that grows with every bet.
              One lucky spin could make you an Olympian.
            </p>
          </div>

          {/* The Agora */}
          <div className="card-marble p-6 border border-gold-600/20 hover:border-gold-600/40 transition-colors">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-display text-gold-500 mb-2">The Agora</h3>
            <p className="text-marble-400 text-sm">
              Live chat with fellow players. Catch crypto rain drops
              from generous gods. Community at its finest.
            </p>
          </div>

          {/* Factions */}
          <div className="card-marble p-6 border border-gold-600/20 hover:border-gold-600/40 transition-colors">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-xl font-display text-gold-500 mb-2">Factions</h3>
            <p className="text-marble-400 text-sm">
              Join Sparta or Athens. Battle for glory in faction wars.
              Earn rewards for your clan.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="badge-sparta text-xs">Sparta</span>
              <span className="badge-athens text-xs">Athens</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rank Progression */}
      <section className="mb-16">
        <h2 className="text-3xl font-display text-center mb-8 text-gold-gradient">
          Your Path to Godhood
        </h2>
        <div className="card-marble p-8 border border-gold-600/20">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { rank: 'Mortal', icon: '👤', ambrosia: '0' },
              { rank: 'Hero', icon: '⚔️', ambrosia: '1,000' },
              { rank: 'Demigod', icon: '🌟', ambrosia: '10,000' },
              { rank: 'Titan', icon: '💪', ambrosia: '50,000' },
              { rank: 'Olympian', icon: '🏛️', ambrosia: '150,000' },
              { rank: 'God', icon: '⚡', ambrosia: '500,000' },
            ].map((tier, index) => (
              <div key={tier.rank} className="text-center">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <div className="font-display text-gold-500">{tier.rank}</div>
                <div className="text-xs text-marble-500">{tier.ambrosia} Ambrosia</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-marble-400 mb-4">
              Every bet earns Ambrosia. Higher ranks unlock better rewards, multipliers, and exclusive features.
            </p>
            <button className="btn-gold">Start Your Odyssey</button>
          </div>
        </div>
      </section>

      {/* Heralds - Affiliate */}
      <section className="mb-16">
        <div className="card-marble p-8 border border-gold-600/20 text-center">
          <div className="text-4xl mb-4">📜</div>
          <h2 className="text-2xl font-display text-gold-500 mb-4">Become a Herald</h2>
          <p className="text-marble-400 mb-6 max-w-2xl mx-auto">
            Spread the word of OlympusBet and earn divine commissions.
            Build your affiliate tree and earn up to 15% on referral activity.
          </p>
          <button className="btn-gold">Get Your Referral Code</button>
        </div>
      </section>
    </div>
  );
}
