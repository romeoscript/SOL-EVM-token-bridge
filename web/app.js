/**
 * Main Application Logic - Synapse Style
 */

import { CONFIG } from './config.js';
import {
    connectPhantom,
    connectMetaMask,
    disconnectPhantom,
    disconnectMetaMask,
    getSolanaBalance,
    getERC20Balance,
    formatAddress,
    setupWalletListeners,
    walletState,
} from './wallets.js';
import {
    bridgeFromSolanaToSepolia,
    bridgeFromSepoliaToSolana,
    getTransferQuote,
    resetTransferState,
    validateTransfer,
    transferState,
} from './bridge.js';

// Application state
const appState = {
    sourceChain: 'Solana',
    destChain: 'Sepolia',
    amount: '',
    sourceBalance: 0,
    destBalance: 0,
    selectedToken: 'USDC', // Currently selected token
};

/**
 * Initialize the application
 */
async function initApp() {
    console.log('🌉 Initializing Wormhole Bridge UI...');

    setupEventListeners();
    setupWalletListeners(onWalletStateChange);
    await autoConnectWallets();
    updateUI();

    console.log('✅ Bridge UI ready!');
}

/**
 * Auto-connect to wallets if previously connected
 */
async function autoConnectWallets() {
    if (window.solana?.isConnected) {
        await connectPhantom();
    }

    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectMetaMask();
            }
        } catch (error) {
            console.error('Error auto-connecting MetaMask:', error);
        }
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Solana connect button
    document.getElementById('connect-solana-btn').addEventListener('click', handleSolanaConnect);

    // EVM connect button
    document.getElementById('connect-evm-btn').addEventListener('click', handleEvmConnect);

    // Swap button
    document.getElementById('swap-btn').addEventListener('click', handleSwap);

    // Amount input
    document.getElementById('amount-input').addEventListener('input', handleAmountChange);

    // Bridge button
    document.getElementById('bridge-btn').addEventListener('click', handleBridge);

    // Token selection
    document.getElementById('from-token-select').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTokenDropdown();
    });

    // Token dropdown items
    document.querySelectorAll('.token-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const token = e.currentTarget.getAttribute('data-token');
            selectToken(token);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        closeTokenDropdown();
    });

    // Transfer step updates
    window.addEventListener('transferStepUpdate', handleTransferStepUpdate);
}

/**
 * Handle Solana wallet connection
 */
async function handleSolanaConnect() {
    const btn = document.getElementById('connect-solana-btn');
    const btnText = document.getElementById('solana-btn-text');

    if (walletState.phantom.connected) {
        await disconnectPhantom();
        btnText.textContent = 'Connect Sol';
        btn.classList.remove('connected');
    } else {
        btnText.innerHTML = '<span class="spinner"></span>';
        btn.disabled = true;

        const result = await connectPhantom();

        if (result.success) {
            btnText.textContent = formatAddress(result.address, 4, 4);
            btn.classList.add('connected');
        } else {
            alert(result.error);
            btnText.textContent = 'Connect Sol';
        }

        btn.disabled = false;
    }

    updateUI();
}

/**
 * Handle EVM wallet connection
 */
async function handleEvmConnect() {
    const btn = document.getElementById('connect-evm-btn');
    const btnText = document.getElementById('evm-btn-text');

    if (walletState.metamask.connected) {
        disconnectMetaMask();
        btnText.textContent = 'Connect EVM';
        btn.classList.remove('connected');
    } else {
        btnText.innerHTML = '<span class="spinner"></span>';
        btn.disabled = true;

        const result = await connectMetaMask();

        if (result.success) {
            btnText.textContent = formatAddress(result.address, 4, 4);
            btn.classList.add('connected');
        } else {
            alert(result.error);
            btnText.textContent = 'Connect EVM';
        }

        btn.disabled = false;
    }

    updateUI();
}

/**
 * Handle chain swap
 */
function handleSwap() {
    const temp = appState.sourceChain;
    appState.sourceChain = appState.destChain;
    appState.destChain = temp;

    // Clear amount
    document.getElementById('amount-input').value = '';
    appState.amount = '';

    updateUI();
}

/**
 * Handle amount input change
 */
async function handleAmountChange(event) {
    appState.amount = event.target.value;
    await updateReceiveAmount();
    updateBridgeButton();
}

/**
 * Handle bridge button click
 */
async function handleBridge() {
    const destAddress = appState.destChain === 'Solana'
        ? walletState.phantom.address
        : walletState.metamask.address;

    const validation = validateTransfer(
        appState.amount,
        appState.sourceChain,
        appState.destChain,
        destAddress
    );

    if (!validation.valid) {
        alert('Transfer validation failed:\n' + validation.errors.join('\n'));
        return;
    }

    const confirmed = confirm(
        `Bridge ${appState.amount} USDC from ${appState.sourceChain} to ${appState.destChain}?`
    );

    if (!confirmed) return;

    // Show status
    document.getElementById('tx-status').classList.remove('hidden');
    document.getElementById('bridge-btn').disabled = true;

    // Initiate transfer
    let result;
    if (appState.sourceChain === 'Solana') {
        result = await bridgeFromSolanaToSepolia(appState.amount);
    } else {
        result = await bridgeFromSepoliaToSolana(appState.amount);
    }

    // Update UI
    if (result.success) {
        updateStatusBadge('success', 'Completed');
    } else {
        updateStatusBadge('error', 'Failed');
    }

    document.getElementById('bridge-btn').disabled = false;
}

/**
 * Handle transfer step updates
 */
function handleTransferStepUpdate(event) {
    const { allSteps } = event.detail;
    renderStatusSteps(allSteps);
}

/**
 * Render status steps
 */
function renderStatusSteps(steps) {
    const container = document.getElementById('status-steps');
    container.innerHTML = '';

    steps.forEach((step) => {
        const stepEl = document.createElement('div');
        stepEl.className = `status-step ${step.status}`;

        let icon = '⏳';
        if (step.status === 'completed') icon = '✅';
        if (step.status === 'error') icon = '❌';
        if (step.status === 'active') icon = '🔄';

        stepEl.innerHTML = `
            <span class="step-icon">${icon}</span>
            <span>${step.message}</span>
        `;

        container.appendChild(stepEl);
    });
}

/**
 * Update status badge
 */
function updateStatusBadge(type, text) {
    const badge = document.getElementById('status-badge');
    badge.className = `status-badge ${type}`;
    badge.textContent = text;
}

/**
 * Update receive amount
 */
async function updateReceiveAmount() {
    const receiveEl = document.getElementById('receive-amount');

    if (!appState.amount || parseFloat(appState.amount) <= 0) {
        receiveEl.textContent = '0.0000';
        return;
    }

    const quote = await getTransferQuote(
        appState.amount,
        appState.sourceChain,
        appState.destChain
    );

    if (quote.success) {
        receiveEl.textContent = quote.receiveAmount.toFixed(4);
    }
}

/**
 * Update bridge button
 */
function updateBridgeButton() {
    const btn = document.getElementById('bridge-btn');
    const btnText = document.getElementById('bridge-btn-text');
    const amount = parseFloat(appState.amount);

    const sourceConnected = appState.sourceChain === 'Solana'
        ? walletState.phantom.connected
        : walletState.metamask.connected;

    const destConnected = appState.destChain === 'Solana'
        ? walletState.phantom.connected
        : walletState.metamask.connected;

    if (!sourceConnected || !destConnected) {
        btn.disabled = true;
        btnText.textContent = 'Connect Wallets';
    } else if (!amount || amount <= 0) {
        btn.disabled = true;
        btnText.textContent = 'Enter Amount';
    } else if (amount > appState.sourceBalance) {
        btn.disabled = true;
        btnText.textContent = 'Insufficient Balance';
    } else if (transferState.inProgress) {
        btn.disabled = true;
        btnText.innerHTML = '<span class="spinner"></span> Bridging...';
    } else {
        btn.disabled = false;
        const tokenSymbol = CONFIG.TOKENS[appState.selectedToken]?.symbol || 'USDC';
        btnText.textContent = `Bridge ${amount} ${tokenSymbol}`;
    }
}

/**
 * Update balances
 */
async function updateBalances() {
    const token = CONFIG.TOKENS[appState.selectedToken];

    if (!token) return;

    // Update source balance
    if (appState.sourceChain === 'Solana' && walletState.phantom.connected) {
        const balance = await getSolanaBalance(token.solana);
        appState.sourceBalance = parseFloat(balance) || 0;
        document.getElementById('from-balance').textContent = appState.sourceBalance.toFixed(4);
    } else if (appState.sourceChain === 'Sepolia' && walletState.metamask.connected) {
        if (token.sepolia) {
            const balance = await getERC20Balance(token.sepolia);
            appState.sourceBalance = parseFloat(balance) || 0;
            document.getElementById('from-balance').textContent = appState.sourceBalance.toFixed(4);
        } else {
            document.getElementById('from-balance').textContent = 'N/A';
        }
    } else {
        document.getElementById('from-balance').textContent = '--';
    }

    // Update destination balance
    if (appState.destChain === 'Solana' && walletState.phantom.connected) {
        const balance = await getSolanaBalance(token.solana);
        appState.destBalance = parseFloat(balance) || 0;
        document.getElementById('to-balance').textContent = appState.destBalance.toFixed(4);
    } else if (appState.destChain === 'Sepolia' && walletState.metamask.connected) {
        if (token.sepolia) {
            const balance = await getERC20Balance(token.sepolia);
            appState.destBalance = parseFloat(balance) || 0;
            document.getElementById('to-balance').textContent = appState.destBalance.toFixed(4);
        } else {
            document.getElementById('to-balance').textContent = 'N/A';
        }
    } else {
        document.getElementById('to-balance').textContent = '--';
    }
}

/**
 * Called when wallet state changes
 */
async function onWalletStateChange() {
    await updateUI();
}

/**
 * Toggle token dropdown
 */
function toggleTokenDropdown() {
    const dropdown = document.getElementById('token-dropdown');
    dropdown.classList.toggle('hidden');
}

/**
 * Close token dropdown
 */
function closeTokenDropdown() {
    const dropdown = document.getElementById('token-dropdown');
    dropdown.classList.add('hidden');
}

/**
 * Select a token
 */
function selectToken(tokenKey) {
    const token = CONFIG.TOKENS[tokenKey];

    if (!token) return;

    // Update app state
    appState.selectedToken = tokenKey;

    // Update UI
    document.getElementById('from-token-icon').textContent = token.icon;
    document.getElementById('from-token-symbol').textContent = token.symbol;
    document.getElementById('to-token-icon').textContent = token.icon;
    document.getElementById('to-token-symbol').textContent = token.symbol;

    // Update selected state in dropdown
    document.querySelectorAll('.token-dropdown-item').forEach(item => {
        if (item.getAttribute('data-token') === tokenKey) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // Close dropdown
    closeTokenDropdown();

    // Update balances and button
    updateUI();
}

/**
 * Update entire UI
 */
async function updateUI() {
    await updateBalances();
    await updateReceiveAmount();
    updateBridgeButton();
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
