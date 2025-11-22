# Token Bridge Web UI

A modern, beautiful web interface for bridging tokens between Solana and Sepolia using the Wormhole protocol.

## 🎨 Features

- **Wallet Integration**: Connect with Phantom (Solana) and MetaMask (Sepolia)
- **Real-time Balances**: See your USDC balance on both chains
- **Transfer Tracking**: Monitor bridge transactions in real-time
- **Modern Design**: Dark mode with glassmorphism effects and smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

From the project root:

```bash
# Start the development server
npm run web:dev

# Or start and open in browser
npm run web:open
```

Then navigate to http://localhost:3000

## 📁 File Structure

```
web/
├── index.html      # Main HTML file
├── styles.css      # Design system and styles
├── config.js       # Configuration (networks, tokens, etc.)
├── wallets.js      # Wallet connection logic
├── bridge.js       # Bridge transfer logic
└── app.js          # Main application logic
```

## 🔧 How It Works

1. **Wallet Connection**: Users connect their Phantom and MetaMask wallets
2. **Balance Checking**: App fetches USDC balances from both chains
3. **Transfer Initiation**: User enters amount and clicks bridge
4. **Transaction Flow**:
   - Initiate transfer on source chain
   - Wait for Wormhole VAA (attestation)
   - Complete transfer on destination chain
5. **Status Updates**: Real-time progress tracking through all steps

## 🛠️ Technology Stack

- **Pure HTML/CSS/JavaScript** - No framework needed
- **Ethers.js v6** - EVM wallet interactions
- **Solana Web3.js** - Solana wallet interactions
- **Wormhole SDK** - Cross-chain messaging (browser bundle required for full functionality)

## ⚠️ Important Notes

### Current Limitations

The Web UI currently demonstrates the interface and wallet connections. For actual token transfers, the Wormhole SDK needs to be properly bundled for browser use. Currently, actual transfers should use the CLI:

```bash
npm run bridge Testnet Solana Sepolia 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 1
```

### Future Enhancements

- [ ] Bundle Wormhole SDK for browser
- [ ] Add support for more tokens
- [ ] Add transaction history
- [ ] Add network switching for multiple EVM chains
- [ ] Add wallet balance caching
- [ ] Add dark/light mode toggle

## 🎨 Design System

The UI uses a comprehensive design system with:

- **CSS Custom Properties** for theming
- **Glassmorphism** effects for modern look
- **Gradient backgrounds** with animations
- **Smooth transitions** and micro-interactions
- **Responsive grid layouts**
- **Mobile-first approach**

## 📝 Development

To modify the UI:

1. Edit HTML in `index.html`
2. Update styles in `styles.css`
3. Modify logic in `app.js`, `wallets.js`, or `bridge.js`
4. Update configuration in `config.js`
5. Refresh browser to see changes

## 🐛 Troubleshooting

### Wallets Not Detected

Make sure you have:
- [Phantom](https://phantom.app/) installed for Solana
- [MetaMask](https://metamask.io/) installed for Sepolia

### Wrong Network

The app will automatically prompt MetaMask to switch to Sepolia if you're on a different network.

### Balance Not Showing

Make sure:
- Your wallet is connected
- You have USDC tokens (get from [Circle Faucet](https://faucet.circle.com/))
- You're on the correct network

## 📄 License

ISC
