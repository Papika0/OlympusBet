# OlympusBet

🏛️ **Greek Myth Crypto Casino** - Where Mortals Become Gods

A Next.js/NestJS/Prisma/Tailwind monorepo featuring a luxury Marble/Gold themed crypto casino with gamification features.

## 🌟 Features

### The Odyssey - RPG Leveling System
- **Ambrosia (XP)** earned from every bet
- **Rank Progression**: Mortal → Hero → Demigod → Titan → Olympian → God
- Rank-based multipliers and exclusive rewards
- 10 levels per rank with progress tracking

### Golden Fleece - Progressive Jackpot
- Global progressive jackpot that grows with every bet
- 1% contribution rate from all bets
- Provably fair win mechanics
- Jackpot history and winner tracking

### The Agora - Live Chat
- Real-time Socket.io chat
- **Crypto Rain** - Users can make it rain crypto for the community
- Rank badges and faction indicators
- Multiple chat rooms (public & faction-specific)

### Factions - Sparta vs Athens
- Choose your side in the eternal rivalry
- Faction wars with prize pools
- XP contributions to faction total
- Leaderboards and rewards

### Heralds - Affiliate System
- Multi-level affiliate tree (up to 3 levels)
- 5-15% commission tiers based on referrals
- Affiliate dashboard and tracking
- Automatic commission distribution

## 📁 Project Structure

```
olympusbet/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   ├── components/  # React components
│   │   │   │   ├── chat/
│   │   │   │   ├── gamification/
│   │   │   │   └── ui/
│   │   │   ├── lib/         # Utilities
│   │   │   └── styles/      # Tailwind styles
│   │   └── public/
│   │
│   └── api/                 # NestJS backend
│       └── src/
│           ├── modules/
│           │   ├── gamification/  # The Odyssey
│           │   ├── jackpot/       # Golden Fleece
│           │   ├── chat/          # The Agora
│           │   ├── faction/       # Sparta vs Athens
│           │   └── affiliate/     # Heralds
│           ├── common/
│           └── config/
│
├── packages/
│   ├── database/            # Prisma schema & client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │
│   ├── shared/              # Shared business logic
│   │   └── src/
│   │       ├── services/
│   │       │   ├── GamificationService.ts
│   │       │   ├── GoldenFleeceService.ts
│   │       │   ├── AgoraService.ts
│   │       │   ├── FactionService.ts
│   │       │   └── HeraldService.ts
│   │       └── constants/
│   │
│   └── ui/                  # Shared UI components
│
├── package.json             # Root workspace config
├── turbo.json              # Turborepo config
└── .gitignore
```

## 🗄️ Database Schema

### Core Models

- **User** - Player accounts with gamification stats
- **Wallet** - Crypto wallet with balance tracking
- **Bet** - Bet records with provably fair data
- **Faction** - Sparta & Athens factions
- **GoldenFleeceJackpot** - Progressive jackpot state
- **ChatRoom/ChatMessage** - Chat infrastructure
- **CryptoRain/CryptoRainClaim** - Rain distribution

### Gamification Models

- **UserAchievement** - Unlocked achievements
- **Achievement** - Achievement definitions
- **FactionWar** - War events and scoring
- **JackpotWin** - Jackpot win history

## 🎮 GamificationService

The `GamificationService` handles all XP/Ambrosia logic:

```typescript
// Calculate ambrosia from a bet
const ambrosia = gamificationService.calculateAmbrosiaFromBet(
  wagerAmount,
  currentRank,
  isWin,
  multiplier
);

// Award ambrosia and check for rank up
const result = gamificationService.awardAmbrosia(userState, ambrosia);
// Returns: { ambrosiaEarned, newRank, rankUp, levelUp, ... }

// Get progress information
const progress = gamificationService.getProgressInfo(userState);
// Returns: { currentRank, nextRank, progressToNextRank, ... }
```

## 🎨 Theme

Luxury Marble/Gold aesthetic with:
- Gold accents (`#FFD700`, `#D4AF37`)
- Marble backgrounds with subtle textures
- Rank-specific colors (Bronze → Diamond)
- Faction colors (Sparta Red, Athens Blue)
- Cinzel display font for Greek-inspired typography

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start development
npm run dev

# Build for production
npm run build
```

## 📝 Environment Variables

```env
DATABASE_URL="postgresql://..."
CORS_ORIGIN="http://localhost:3000"
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific package tests
cd packages/shared && npm test
```

## 📜 License

MIT