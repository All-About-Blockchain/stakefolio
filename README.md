# Stakefolio - Liquid Staking Made Simple

Stakefolio is a simplified liquid staking platform for the Cosmos ecosystem. Users can buy ATOM and automatically earn staking rewards through Stride's liquid staking protocol, all while maintaining the simplicity of a single-chain experience.

## Features

- **Buy & Auto-Stake**: Purchase ATOM and automatically convert to stATOM for instant rewards
- **Liquid Staking**: Your staked assets remain liquid and can be used in DeFi protocols
- **Portfolio Management**: Track your liquid staking assets and performance
- **Asset Swapping**: Easily swap between different staked assets to optimize returns
- **CosmosHub Only**: Simplified single-chain experience focused on CosmosHub

## Supported Assets

- **stATOM**: Stride Liquid Staked ATOM (8.5% APR)
- **stOSMO**: Stride Liquid Staked OSMO (9.2% APR)
- **stJUNO**: Stride Liquid Staked JUNO (7.8% APR)
- **stSTARS**: Stride Liquid Staked STARS (8.2% APR)
- **stSCRT**: Stride Liquid Staked SCRT (7.5% APR)

## Getting Started

1. **Connect Wallet**: Use Keplr, Cosmostation, or Leap wallet
2. **Buy ATOM**: Purchase ATOM through our on-ramp integration
3. **Auto-Stake**: Your ATOM is automatically converted to stATOM
4. **Earn Rewards**: Start earning staking rewards immediately
5. **Diversify**: Swap between different staked assets as needed

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: CosmosHub, Stride Protocol
- **Wallet Integration**: Keplr, Cosmostation, Leap
- **On-Ramp**: Transak integration for fiat purchases

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/
│   ├── components/          # React components
│   ├── config/             # Chain and token configurations
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   └── types.tsx           # TypeScript type definitions
├── pages/                  # Next.js pages
├── public/                 # Static assets
└── package.json
```

## Key Components

- **Portfolio**: Main dashboard showing liquid staking assets
- **Swap**: Interface for swapping between staked assets
- **Onboarding**: Simplified flow for new users
- **Wallet Integration**: Support for major Cosmos wallets

## Architecture

The application is built around the concept of liquid staking through Stride Protocol:

1. **User Experience**: Users only interact with CosmosHub
2. **Backend Complexity**: Stride protocol handles the liquid staking mechanics
3. **Asset Management**: All staked assets are represented as liquid staking tokens
4. **Simplified Swapping**: Users can swap between different staked assets without understanding the underlying complexity

## Contributing

This is a simplified version focused on user experience. The complexity of cross-chain operations and validator management is abstracted away, allowing users to focus on earning rewards through liquid staking.

## License

MIT License
