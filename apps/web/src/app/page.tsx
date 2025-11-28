'use client';

import { OdysseyProgressBar } from '@olympusbet/ui';

/**
 * OlympusBet Home Page
 * 
 * The grand entrance to Mount Olympus - showcasing the divine
 * design system and core gamification components.
 */
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-cinzel font-bold text-gold-gradient mb-4">
          OlympusBet
        </h1>
        <p className="text-xl text-slate-400 font-inter">
          Ascend to Olympus. Win Divine Rewards.
        </p>
      </div>

      {/* Odyssey Progress Demo */}
      <section className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-cinzel font-bold text-olympus-gold mb-6 text-center">
            The Odyssey
          </h2>
          <p className="text-slate-400 text-center mb-8 font-inter">
            Your journey from Mortal to Olympian. Earn Ambrosia with every wager.
          </p>
          
          {/* Progress Bar Demo - Hoplite rank with 5000 Ambrosia */}
          <OdysseyProgressBar
            currentAmbrosia={5000}
            currentRank="HOPLITE"
            showDetails={true}
          />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Faction Wars Card */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-cinzel font-bold text-olympus-gold mb-3">
            ⚔️ Faction Wars
          </h3>
          <p className="text-slate-400 font-inter text-sm">
            Choose your allegiance: Sparta or Athens. Compete weekly for 
            rakeback bonuses and exclusive rewards.
          </p>
        </div>

        {/* Heralds Referral Card */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-cinzel font-bold text-olympus-gold mb-3">
            📜 The Heralds
          </h3>
          <p className="text-slate-400 font-inter text-sm">
            Become a Herald. Spread the word of Olympus and earn from your 
            recruits&apos; wagers. Multi-tier rewards await.
          </p>
        </div>

        {/* The Agora Card */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-cinzel font-bold text-olympus-gold mb-3">
            🏛️ The Agora
          </h3>
          <p className="text-slate-400 font-inter text-sm">
            Join the global gathering. Chat with fellow players and catch 
            Zeus&apos;s Rain - random crypto drops every 4 hours!
          </p>
        </div>

        {/* Golden Fleece Card */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-cinzel font-bold text-olympus-gold mb-3">
            🏺 Golden Fleece
          </h3>
          <p className="text-slate-400 font-inter text-sm">
            Level up to unlock Golden Fleece chests. Each chest contains 
            crypto rewards or exclusive NFTs.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center mt-16 text-slate-500 text-sm font-inter">
        <p>⚡ Built with Divine Precision ⚡</p>
        <p className="mt-2">OlympusBet © 2024</p>
      </footer>
    </main>
  );
}
