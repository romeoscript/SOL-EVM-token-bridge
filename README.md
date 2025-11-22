# 🌉 Solana-EVM Token Bridge

Cross-chain token bridge between Solana and EVM chains using Wormhole protocol.

## 📦 Prerequisites

- Node.js v18+
- Solana wallet with private key
- EVM wallet with private key
- Testnet tokens:
  - SOL on Solana Devnet ([Faucet](https://faucet.solana.com/))
  - USDC on Solana Devnet ([Faucet](https://faucet.circle.com/))
  - ETH on destination chain (see faucets below)

## 🚀 Installation

```bash
# Clone and install
git clone <https://github.com/romeoscript/SOL-EVM-token-bridge.git>
cd SOL-EVM-token-bridge
npm install

# Setup environment
cp .env.example .env
# Edit .env with your private keys
```

## ⚙️ Configuration

Create `.env` file:

```env
SOL_PRIVATE_KEY=your_solana_private_key_here
ETH_PRIVATE_KEY=your_ethereum_private_key_here
```

**Private Key Formats:**
- Solana: Base58 string or JSON array
- Ethereum: Hex string (with or without 0x prefix)

## 🔧 Usage

### Bridge Pre-Registered Tokens

```bash
# Bridge 10 USDC from Solana to Sepolia
npm run bridge Testnet Solana Sepolia 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 10

# Bridge 0.1 SOL to Sepolia (arrives as Wrapped SOL)
npm run bridge Testnet Solana Sepolia native 0.1
```



### USDC Operations

```bash
# Setup USDC account on Solana
npm run usdc:setup

# Check USDC balance on Solana
npm run usdc:check-solana

# Check wrapped USDC on Sepolia
npm run usdc:check-sepolia
```

### Utility Commands

```bash
# Check native balance (SOL/ETH)
npm run check-balance

# Check token balance
npm run check-token

# Check if token is registered
npm run check-registration

# List supported chains
npm run list-chains

# List pre-registered tokens
npm run list-tokens
```


## 🌐 Supported Chains & Tokens

### ✅ Ready-to-Use Routes (Pre-Registered)
These routes are fully set up and ready for bridging immediately. No registration required.

| Token | Source Chain | Destination Chain | Token Address (Source) | Wrapped Address (Destination) |
| :--- | :--- | :--- | :--- | :--- |
| **USDC** | Solana Devnet | Sepolia Testnet | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` | `0x9278e9d9ed88E631285B0F1b49d6BB86FEFE9147` |
| **SOL** | Solana Devnet | Sepolia Testnet | `native` | `0x824CB8fC742F8D3300d29f16cA8beE94471169f5` |



## 🔗 Faucets

| Chain | Faucet URL |
|-------|-----------|
| Solana | https://faucet.solana.com/ |
| USDC | https://faucet.circle.com/ |
| Sepolia | https://sepoliafaucet.com/ |

## 🔧 Troubleshooting

### Insufficient Funds
Ensure you have gas tokens on BOTH chains:
- Source chain (SOL) to initiate transfer
- Destination chain (ETH) to complete transfer

### Token Not Registered
```bash
# Check registration status
npm run check-registration

# Register if needed
npm run register Testnet Solana <token-address> <dest-chain>
```

### Transfer Stuck
For manual transfers, resume with transaction ID:
```bash
npm run bridge Testnet Solana Sepolia <token> <amount> <transaction-id>
```

### Import Wrapped Token to MetaMask
1. Open MetaMask
2. Switch to destination network
3. Click "Import tokens"
4. Paste wrapped token address (see table above)

## 📖 Complete Example: Bridge USDC

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
```

## 📄 License

ISC

## 🔗 Resources

- [Wormhole Documentation](https://docs.wormhole.com/)
- [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts)
- [Wormhole Scan](https://wormholescan.io/) - Transaction explorer
