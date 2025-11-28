# OlympusBet

⚡ **Divine Crypto Casino** - A next-generation crypto casino blending high-end iGaming with Greek Mythology RPG mechanics.

## 🏛️ Architecture

This is a **Turborepo** monorepo with the following structure:

```
olympusbet/
├── apps/
│   ├── web/          # Next.js 14 Frontend (App Router)
│   └── api/          # NestJS Backend (Microservices)
├── packages/
│   ├── ui/           # Shared React Components
│   └── database/     # Prisma Schema & Client
├── turbo.json        # Turborepo configuration
└── package.json      # Root workspace config
```

## 🎮 Core Features

### The Odyssey (Leveling System)
- Users earn **Ambrosia** (XP) for every wager
- **Ranks**: Mortal → Hoplite → Hero → Demigod → Olympian
- **Golden Fleece Chests** awarded on level-up

### Faction Wars
- Choose: **Sparta** (High variance) or **Athens** (Steady cashback)
- Weekly competition for 5% rakeback boost

### The Heralds (Referrals)
- Multi-tier referral system
- Earn % of house edge from recruits

### The Agora (Chat)
- Global socket-based chat
- **Zeus's Rain** - Random crypto distribution every 4 hours

## 🎨 Design System

**Theme**: "Divine Luxury"
- **Colors**: Midnight Blue (#0f172a), Marble White (#f8fafc), Metallic Gold (#ffd700)
- **Typography**: Cinzel (headings), Inter (body)
- **Style**: Glassmorphism with gold accents

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start development
npm run dev
```

## 📦 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: NestJS, Socket.io
- **Database**: PostgreSQL, Redis
- **ORM**: Prisma
- **Web3**: Wagmi/Viem (EVM compatible)

## 📄 License

MIT