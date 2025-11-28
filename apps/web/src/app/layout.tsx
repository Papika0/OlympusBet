import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'OlympusBet - Greek Myth Crypto Casino',
  description: 'Ascend to Mount Olympus. Play like a God.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-marble-900 text-marble-100">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-gold-600/20 bg-marble-900/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">⚡</span>
                  <h1 className="text-2xl font-display text-gold-gradient font-bold">
                    OlympusBet
                  </h1>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="/games" className="text-marble-300 hover:text-gold-500 transition-colors">Games</a>
                  <a href="/odyssey" className="text-marble-300 hover:text-gold-500 transition-colors">The Odyssey</a>
                  <a href="/jackpot" className="text-marble-300 hover:text-gold-500 transition-colors">Golden Fleece</a>
                  <a href="/agora" className="text-marble-300 hover:text-gold-500 transition-colors">The Agora</a>
                  <a href="/factions" className="text-marble-300 hover:text-gold-500 transition-colors">Factions</a>
                </nav>
                <button className="btn-gold">Connect Wallet</button>
              </div>
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="border-t border-gold-600/20 bg-marble-900 py-8">
            <div className="container mx-auto px-4 text-center text-marble-500">
              <p className="font-display text-gold-gradient mb-2">OlympusBet</p>
              <p className="text-sm">Play responsibly. 18+ only. Gambling can be addictive.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
