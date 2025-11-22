/**
 * Wormhole Bridge Integration Module
 * Handles token transfers between Solana and Sepolia
 */

import { CONFIG } from './config.js';
import { walletState } from './wallets.js';

/**
 * Transfer state tracking
 */
export const transferState = {
    inProgress: false,
    currentStep: null,
    txHash: null,
    vaa: null,
    steps: [],
};

/**
 * Initialize a token transfer from Solana to Sepolia
 */
export async function bridgeFromSolanaToSepolia(amount) {
    try {
        transferState.inProgress = true;
        transferState.steps = [];

        // Note: This is a simplified version. In production, you would:
        // 1. Import Wormhole SDK properly
        // 2. Initialize the Wormhole instance
        // 3. Create the token transfer
        // 4. Track the transfer through all states

        addTransferStep('Initializing transfer...', 'pending');

        // For now, we'll show a message that this requires the Wormhole SDK
        // to be properly imported in a browser environment
        throw new Error(
            'Bridge functionality requires Wormhole SDK browser bundle. ' +
            'This is a UI demonstration. For actual transfers, use the CLI: ' +
            'npm run bridge'
        );

        // The actual implementation would look like this:
        /*
        const { wormhole } = await import('@wormhole-foundation/sdk');
        const evm = await import('@wormhole-foundation/sdk/evm');
        const solana = await import('@wormhole-foundation/sdk/solana');
        
        // Initialize Wormhole
        const wh = await wormhole(CONFIG.WORMHOLE.NETWORK, [evm, solana]);
        
        // Get chain contexts
        const sourceChain = wh.getChain('Solana');
        const destChain = wh.getChain('Sepolia');
        
        // Create token ID
        const token = wormhole.tokenId('Solana', CONFIG.TOKENS.USDC_SOLANA);
        
        // Get decimals
        const decimals = await wh.getDecimals(token.chain, token.address);
        
        // Parse amount
        const parsedAmount = amount.units(amount.parse(amount, decimals));
        
        // Create signers from connected wallets
        const sourceSigner = await createSolanaSigner(sourceChain);
        const destSigner = await createEvmSigner(destChain);
        
        // Create source and destination addresses
        const sourceAddress = wormhole.chainAddress('Solana', walletState.phantom.address);
        const destAddress = wormhole.chainAddress('Sepolia', walletState.metamask.address);
        
        addTransferStep('Creating transfer...', 'active');
        
        // Create the transfer
        const xfer = await wh.tokenTransfer(
            token,
            parsedAmount,
            sourceAddress,
            destAddress,
            false, // manual transfer
        );
        
        addTransferStep('Initiating transfer on Solana...', 'active');
        
        // Initiate the transfer
        const srcTxids = await xfer.initiateTransfer(sourceSigner);
        transferState.txHash = srcTxids[0];
        
        addTransferStep(`Transfer initiated: ${srcTxids[0]}`, 'completed');
        addTransferStep('Waiting for VAA...', 'active');
        
        // Wait for attestation
        const attestIds = await xfer.fetchAttestation(CONFIG.UI.TRANSACTION_TIMEOUT);
        transferState.vaa = attestIds;
        
        addTransferStep('VAA received', 'completed');
        addTransferStep('Completing transfer on Sepolia...', 'active');
        
        // Complete the transfer
        const destTxids = await xfer.completeTransfer(destSigner);
        
        addTransferStep(`Transfer completed: ${destTxids[0]}`, 'completed');
        
        transferState.inProgress = false;
        return { success: true, txHash: destTxids[0] };
        */

    } catch (error) {
        console.error('Bridge error:', error);
        addTransferStep(`Error: ${error.message}`, 'error');
        transferState.inProgress = false;
        return { success: false, error: error.message };
    }
}

/**
 * Initialize a token transfer from Sepolia to Solana
 */
export async function bridgeFromSepoliaToSolana(amount) {
    try {
        transferState.inProgress = true;
        transferState.steps = [];

        addTransferStep('Initializing transfer...', 'pending');

        // Similar to above, this would use the Wormhole SDK
        throw new Error(
            'Bridge functionality requires Wormhole SDK browser bundle. ' +
            'This is a UI demonstration. For actual transfers, use the CLI: ' +
            'npm run bridge'
        );

    } catch (error) {
        console.error('Bridge error:', error);
        addTransferStep(`Error: ${error.message}`, 'error');
        transferState.inProgress = false;
        return { success: false, error: error.message };
    }
}

/**
 * Create a Solana signer from Phantom wallet
 */
async function createSolanaSigner(chainContext) {
    // This would create a signer compatible with Wormhole SDK
    // using the Phantom wallet
    return {
        chain: chainContext,
        address: () => walletState.phantom.address,
        signAndSend: async (txs) => {
            // Use Phantom to sign and send transactions
            const signedTxs = [];
            for (const tx of txs) {
                const signed = await window.solana.signTransaction(tx);
                const signature = await window.solana.sendTransaction(signed);
                signedTxs.push(signature);
            }
            return signedTxs;
        },
    };
}

/**
 * Create an EVM signer from MetaMask wallet
 */
async function createEvmSigner(chainContext) {
    // This would create a signer compatible with Wormhole SDK
    // using MetaMask
    const provider = new window.ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return {
        chain: chainContext,
        address: () => walletState.metamask.address,
        signAndSend: async (txs) => {
            // Use MetaMask to sign and send transactions
            const signedTxs = [];
            for (const tx of txs) {
                const response = await signer.sendTransaction(tx);
                await response.wait();
                signedTxs.push(response.hash);
            }
            return signedTxs;
        },
    };
}

/**
 * Add a step to the transfer progress
 */
function addTransferStep(message, status = 'pending') {
    const step = {
        message,
        status, // 'pending', 'active', 'completed', 'error'
        timestamp: new Date(),
    };

    transferState.steps.push(step);
    transferState.currentStep = message;

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('transferStepUpdate', {
        detail: { step, allSteps: transferState.steps }
    }));
}

/**
 * Get transfer quote (estimate fees and receive amount)
 */
export async function getTransferQuote(amount, sourceChain, destChain) {
    try {
        // In a real implementation, this would use Wormhole SDK to get a quote
        // For now, we'll return a mock quote

        const fee = 0.01; // Mock fee
        const receiveAmount = Math.max(0, parseFloat(amount) - fee);

        return {
            success: true,
            sourceAmount: parseFloat(amount),
            fee: fee,
            receiveAmount: receiveAmount,
            estimatedTime: '2-5 minutes',
        };
    } catch (error) {
        console.error('Error getting quote:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Reset transfer state
 */
export function resetTransferState() {
    transferState.inProgress = false;
    transferState.currentStep = null;
    transferState.txHash = null;
    transferState.vaa = null;
    transferState.steps = [];
}

/**
 * Check if a transfer is recoverable (for manual completion)
 */
export async function checkRecoverableTransfer(txHash, sourceChain) {
    try {
        // This would check if there's a pending transfer that can be completed
        // For now, return false
        return { recoverable: false };
    } catch (error) {
        console.error('Error checking recoverable transfer:', error);
        return { recoverable: false, error: error.message };
    }
}

/**
 * Validate transfer parameters
 */
export function validateTransfer(amount, sourceChain, destChain, destAddress) {
    const errors = [];

    // Check amount
    if (!amount || parseFloat(amount) <= 0) {
        errors.push('Amount must be greater than 0');
    }

    if (parseFloat(amount) < parseFloat(CONFIG.UI.MIN_AMOUNT)) {
        errors.push(`Minimum amount is ${CONFIG.UI.MIN_AMOUNT} USDC`);
    }

    // Check source wallet connection
    if (sourceChain === 'Solana' && !walletState.phantom.connected) {
        errors.push('Phantom wallet not connected');
    }

    if (sourceChain === 'Sepolia' && !walletState.metamask.connected) {
        errors.push('MetaMask wallet not connected');
    }

    // Check destination address
    if (!destAddress || destAddress.trim() === '') {
        errors.push('Destination address is required');
    } else {
        // Basic validation for address format
        if (destChain === 'Sepolia') {
            // Check if it's a valid Ethereum address (0x + 40 hex chars)
            if (!/^0x[a-fA-F0-9]{40}$/.test(destAddress)) {
                errors.push('Invalid Sepolia address format');
            }
        } else if (destChain === 'Solana') {
            // Solana addresses are base58 and typically 32-44 characters
            if (destAddress.length < 32 || destAddress.length > 44) {
                errors.push('Invalid Solana address format');
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
