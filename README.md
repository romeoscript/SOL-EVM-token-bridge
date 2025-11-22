# Solana-EVM Token Bridge

Cross-chain token bridge between Solana and EVM chains using Wormhole protocol.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Supported Chains](#supported-chains)
- [Supported Tokens](#supported-tokens)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- ✅ **Web UI** for easy token bridging with wallet integration
- ✅ Bridge tokens between Solana and multiple EVM testnets
- ✅ Support for USDC and Wrapped SOL (pre-registered)
- ✅ Create and bridge custom SPL tokens
- ✅ Manual and automatic transfer modes
- ✅ Token registration (attestation) on destination chains
- ✅ Balance checking utilities
- ✅ Multi-chain support (Sepolia, Arbitrum, Base, Optimism, etc.)

## 📦 Prerequisites

- Node.js v18+ and npm
- Solana wallet with SOL on Devnet
- EVM wallet with testnet ETH
- Private keys for both wallets

## 🚀 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd SOL-EVM-token-bridge

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
SOL_PRIVATE_KEY=your_solana_private_key_here
ETH_PRIVATE_KEY=your_ethereum_private_key_here
```

**Private Key Formats:**
- Solana: Base58 string or JSON array
- Ethereum: Hex string (with or without 0x prefix)

## 🌐 Web UI

### Quick Start

The easiest way to bridge tokens is using the web interface:

```bash
# Start the development server
npm run web:dev

# Or start and open in browser automatically
npm run web:open
```

Then open http://localhost:3000 in your browser.

### Features

- 🦊 **MetaMask Integration** - Connect your MetaMask wallet for Sepolia
- 👻 **Phantom Integration** - Connect your Phantom wallet for Solana
- 💰 **Real-time Balances** - See your USDC balance on both chains
- 🔄 **Swap Direction** - Easily switch between Solana → Sepolia and Sepolia → Solana
- 📊 **Transfer Tracking** - Monitor your bridge transaction in real-time
- 🎨 **Modern UI** - Beautiful dark mode with glassmorphism effects
- 📱 **Responsive** - Works on desktop, tablet, and mobile

### Requirements

To use the Web UI, you need:
1. **Phantom Wallet** - [Download here](https://phantom.app/)
2. **MetaMask Wallet** - [Download here](https://metamask.io/)
3. **Testnet Tokens**:
   - SOL on Solana Devnet (for gas)
   - USDC on Solana Devnet (to bridge)
   - ETH on Sepolia (for gas on destination)

### How to Use

1. **Connect Wallets**: Click "Connect Phantom" and "Connect MetaMask"
2. **Enter Amount**: Type the amount of USDC you want to bridge
3. **Review**: Check the estimated fees and receive amount
4. **Bridge**: Click the bridge button and approve transactions in your wallets
5. **Wait**: The transfer takes ~2-5 minutes to complete
6. **Done**: Your USDC will appear on the destination chain!

### Important Notes

> **⚠️ Testnet Only**: The Web UI is configured for testnets (Solana Devnet and Sepolia). Never use mainnet private keys or large amounts.

> **💡 Browser Wallets**: The Web UI uses browser wallet extensions for signing. This is more secure than using private keys directly.

> **🔧 CLI Alternative**: For advanced features or automation, use the CLI commands below.



## 📖 Usage

### Core Bridging

#### Bridge Tokens
```bash
# Bridge USDC from Solana to Sepolia
npm run bridge Testnet Solana Sepolia 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 10

# Bridge Wrapped SOL from Solana to Sepolia
npm run bridge Testnet Solana Sepolia So11111111111111111111111111111111111111112 0.1

# Bridge to different chains
npm run bridge Testnet Solana BaseSepolia <token-address> <amount>
npm run bridge Testnet Solana ArbitrumSepolia <token-address> <amount>
```

#### Register Custom Token
```bash
# Register a new token on the destination chain
npm run register Testnet Solana <token-address> Sepolia

# Resume registration with saved attestation
npm run register Testnet Solana <token-address> Sepolia <attestation-txid>
```

### USDC Operations

```bash
# Setup USDC account on Solana
npm run usdc:setup

# Check USDC balance on Solana
npm run usdc:check-solana

# Check wrapped USDC balance on Sepolia
npm run usdc:check-sepolia
```

### Token Creation

```bash
# Create a new SPL token with metadata
npm run create-token
```

### Utilities

```bash
# Check native balance (ETH/SOL)
npm run check-balance

# Check specific token balance
npm run check-token

# Check if token is registered on destination
npm run check-registration

# List all supported chains
npm run list-chains

# List pre-registered tokens
npm run list-tokens
```

## 🌐 Supported Chains

### Source Chain
- **Solana Devnet**

### Destination Chains (EVM Testnets)
- **Sepolia** - Ethereum testnet
- **Arbitrum Sepolia** - Arbitrum L2 testnet
- **Base Sepolia** - Base L2 testnet (Coinbase)
- **Optimism Sepolia** - Optimism L2 testnet
- **Polygon Sepolia** - Polygon testnet
- **Holesky** - Ethereum Holesky testnet

### Faucets

| Chain | Faucet URL |
|-------|-----------|
| Solana | https://faucet.solana.com/ |
| USDC | https://faucet.circle.com/ |
| Base Sepolia | https://portal.cdp.coinbase.com/products/faucet |
| Arbitrum Sepolia | https://faucet.quicknode.com/arbitrum/sepolia |
| Optimism Sepolia | https://app.optimism.io/faucet |
| Polygon Sepolia | https://faucet.polygon.technology/ |

## 🪙 Supported Tokens

### Pre-Registered Tokens (Ready to Bridge)

| Token | Solana Address | Sepolia Wrapped Address |
|-------|---------------|------------------------|
| USDC | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` | `0x9278e9d9ed88E631285B0F1b49d6BB86FEFE9147` |
| Wrapped SOL | `So11111111111111111111111111111111111111112` | `0x824CB8fC742F8D3300d29f16cA8beE94471169f5` |

### Custom Tokens

Custom SPL tokens require registration before bridging. Note: Registration may fail on some testnets due to network limitations.

## 📁 Project Structure

```
src/
├── core/                    # Core bridging functionality
│   ├── token-transfer.ts    # Main token transfer logic
│   └── create-wrapped-token.ts  # Token registration
├── utils/                   # Utility scripts
│   ├── check-balance.ts     # Check native balance
│   ├── check-token-balance.ts   # Check token balance
│   ├── check-token-registration.ts  # Check registration status
│   ├── list-chains.ts       # List supported chains
│   └── list-registered-tokens.ts    # List pre-registered tokens
├── usdc/                    # USDC-specific utilities
│   ├── setup-usdc.ts        # Setup USDC account
│   ├── check-usdc-balance.ts    # Check Solana USDC
│   └── check-sepolia-usdc.ts    # Check Sepolia USDC
├── token-creation/          # Token creation
│   └── create-spl-token.ts  # Create new SPL token
├── helpers/                 # Shared helper functions
│   ├── index.ts
│   └── helpers.ts
├── archive/                 # Archived/unused scripts
└── config.ts                # Centralized configuration
```

## 🔧 Troubleshooting

### TypeScript Errors

All TypeScript type errors should be resolved. If you encounter any:
```bash
npm install --save-dev @types/bs58
```

### Token Not Showing in MetaMask

Wrapped tokens need to be manually imported:
1. Open MetaMask
2. Switch to the correct network (e.g., Sepolia)
3. Click "Import tokens"
4. Paste the wrapped token address
5. Click "Import"

### Registration Fails on Sepolia

This is a known limitation with Sepolia testnet. Try:
1. Use an alternative chain (Base Sepolia, Arbitrum Sepolia)
2. Use pre-registered tokens (USDC, Wrapped SOL)
3. Check you have sufficient testnet ETH for gas

### Insufficient Funds Error

Make sure you have:
- SOL on Solana Devnet for transaction fees
- Testnet ETH on destination chain for gas fees
- Tokens you want to bridge

### Transfer Stuck

For manual transfers, the process has 3 steps:
1. Initiate on source chain
2. Wait for attestation (~12 seconds)
3. Complete on destination chain

If stuck, you can resume with the transaction ID.

## 📝 Examples

### Complete USDC Bridge Flow

```bash
# 1. Setup USDC account
npm run usdc:setup

# 2. Get USDC from faucet
# Visit: https://faucet.circle.com/

# 3. Check balance
npm run usdc:check-solana

# 4. Bridge to Sepolia
npm run bridge Testnet Solana Sepolia 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 10

# 5. Verify on Sepolia
npm run usdc:check-sepolia

# 6. Import to MetaMask
# Address: 0x9278e9d9ed88E631285B0F1b49d6BB86FEFE9147
```

### Custom Token Bridge Flow

```bash
# 1. Create token
npm run create-token

# 2. Get testnet ETH on destination chain

# 3. Register token
npm run register Testnet Solana <your-token-address> ArbitrumSepolia

# 4. Bridge tokens
npm run bridge Testnet Solana ArbitrumSepolia <your-token-address> 100
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🔗 Links

- [Wormhole Documentation](https://docs.wormhole.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts)
