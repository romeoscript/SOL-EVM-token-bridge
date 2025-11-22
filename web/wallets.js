/**
 * Wallet Management Module
 * Handles MetaMask and Phantom wallet connections
 */

import { CONFIG } from './config.js';

// Wallet state
export const walletState = {
    phantom: {
        connected: false,
        address: null,
        publicKey: null,
    },
    metamask: {
        connected: false,
        address: null,
    },
};

/**
 * Check if Phantom wallet is installed
 */
export function isPhantomInstalled() {
    return window.solana && window.solana.isPhantom;
}

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
    return window.ethereum && window.ethereum.isMetaMask;
}

/**
 * Connect to Phantom wallet
 */
export async function connectPhantom() {
    try {
        if (!isPhantomInstalled()) {
            throw new Error('Phantom wallet is not installed. Please install it from phantom.app');
        }

        const resp = await window.solana.connect();
        const publicKey = resp.publicKey.toString();

        walletState.phantom.connected = true;
        walletState.phantom.address = publicKey;
        walletState.phantom.publicKey = resp.publicKey;

        console.log('Phantom connected:', publicKey);
        return { success: true, address: publicKey };
    } catch (error) {
        console.error('Error connecting to Phantom:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Disconnect Phantom wallet
 */
export async function disconnectPhantom() {
    try {
        if (window.solana && window.solana.disconnect) {
            await window.solana.disconnect();
        }
        walletState.phantom.connected = false;
        walletState.phantom.address = null;
        walletState.phantom.publicKey = null;
        return { success: true };
    } catch (error) {
        console.error('Error disconnecting Phantom:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Connect to MetaMask wallet
 */
export async function connectMetaMask() {
    try {
        if (!isMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed. Please install it from metamask.io');
        }

        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }

        const address = accounts[0];

        // Check if we're on Sepolia network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== CONFIG.SEPOLIA.CHAIN_ID) {
            // Try to switch to Sepolia
            await switchToSepolia();
        }

        walletState.metamask.connected = true;
        walletState.metamask.address = address;

        console.log('MetaMask connected:', address);
        return { success: true, address };
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Disconnect MetaMask wallet
 */
export function disconnectMetaMask() {
    walletState.metamask.connected = false;
    walletState.metamask.address = null;
    return { success: true };
}

/**
 * Switch MetaMask to Sepolia network
 */
export async function switchToSepolia() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONFIG.SEPOLIA.CHAIN_ID }],
        });
        return { success: true };
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: CONFIG.SEPOLIA.CHAIN_ID,
                        chainName: CONFIG.SEPOLIA.CHAIN_NAME,
                        nativeCurrency: CONFIG.SEPOLIA.CURRENCY,
                        rpcUrls: [CONFIG.SEPOLIA.RPC_ENDPOINT],
                        blockExplorerUrls: [CONFIG.SEPOLIA.BLOCK_EXPLORER],
                    }],
                });
                return { success: true };
            } catch (addError) {
                console.error('Error adding Sepolia network:', addError);
                return { success: false, error: addError.message };
            }
        }
        console.error('Error switching to Sepolia:', switchError);
        return { success: false, error: switchError.message };
    }
}

/**
 * Get Solana balance for connected wallet
 */
export async function getSolanaBalance(tokenMint) {
    try {
        if (!walletState.phantom.connected) {
            throw new Error('Phantom wallet not connected');
        }

        const connection = new window.solanaWeb3.Connection(
            CONFIG.SOLANA.RPC_ENDPOINT,
            'confirmed'
        );

        if (tokenMint === 'native') {
            // Get SOL balance
            const balance = await connection.getBalance(walletState.phantom.publicKey);
            return balance / 1e9; // Convert lamports to SOL
        } else {
            // Get SPL token balance
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                walletState.phantom.publicKey,
                { mint: new window.solanaWeb3.PublicKey(tokenMint) }
            );

            if (tokenAccounts.value.length === 0) {
                return 0;
            }

            const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            return balance;
        }
    } catch (error) {
        console.error('Error getting Solana balance:', error);
        return 0;
    }
}

/**
 * Get ERC20 token balance for connected MetaMask wallet
 */
export async function getERC20Balance(tokenAddress) {
    try {
        if (!walletState.metamask.connected) {
            throw new Error('MetaMask wallet not connected');
        }

        const provider = new window.ethers.BrowserProvider(window.ethereum);

        if (tokenAddress === 'native') {
            // Get ETH balance
            const balance = await provider.getBalance(walletState.metamask.address);
            return window.ethers.formatEther(balance);
        } else {
            // Get ERC20 token balance
            const erc20Abi = [
                'function balanceOf(address owner) view returns (uint256)',
                'function decimals() view returns (uint8)',
            ];

            const contract = new window.ethers.Contract(tokenAddress, erc20Abi, provider);
            const balance = await contract.balanceOf(walletState.metamask.address);
            const decimals = await contract.decimals();

            return window.ethers.formatUnits(balance, decimals);
        }
    } catch (error) {
        console.error('Error getting ERC20 balance:', error);
        return 0;
    }
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Setup wallet event listeners
 */
export function setupWalletListeners(onAccountChange) {
    // MetaMask account change listener
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length === 0) {
                disconnectMetaMask();
            } else {
                walletState.metamask.address = accounts[0];
                walletState.metamask.connected = true;
            }
            if (onAccountChange) onAccountChange();
        });

        window.ethereum.on('chainChanged', () => {
            // Reload the page when chain changes
            window.location.reload();
        });
    }

    // Phantom account change listener
    if (window.solana) {
        window.solana.on('connect', (publicKey) => {
            walletState.phantom.connected = true;
            walletState.phantom.address = publicKey.toString();
            walletState.phantom.publicKey = publicKey;
            if (onAccountChange) onAccountChange();
        });

        window.solana.on('disconnect', () => {
            disconnectPhantom();
            if (onAccountChange) onAccountChange();
        });

        window.solana.on('accountChanged', (publicKey) => {
            if (publicKey) {
                walletState.phantom.address = publicKey.toString();
                walletState.phantom.publicKey = publicKey;
                walletState.phantom.connected = true;
            } else {
                disconnectPhantom();
            }
            if (onAccountChange) onAccountChange();
        });
    }
}

/**
 * Check if both wallets are connected
 */
export function areBothWalletsConnected() {
    return walletState.phantom.connected && walletState.metamask.connected;
}
