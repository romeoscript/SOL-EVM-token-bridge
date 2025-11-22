/**
 * Frontend Configuration for Token Bridge UI
 */

export const CONFIG = {
    // Network Configuration
    NETWORK: 'Testnet',

    // Solana Configuration
    SOLANA: {
        NETWORK: 'devnet',
        RPC_ENDPOINT: 'https://api.devnet.solana.com',
        CHAIN_NAME: 'Solana',
    },

    // Sepolia Configuration
    SEPOLIA: {
        CHAIN_ID: '0xaa36a7',
        CHAIN_ID_DECIMAL: 11155111,
        CHAIN_NAME: 'Sepolia',
        RPC_ENDPOINT: 'https://rpc.sepolia.org',
        BLOCK_EXPLORER: 'https://sepolia.etherscan.io',
        CURRENCY: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },

    // Token Addresses
    TOKENS: {
        USDC: {
            symbol: 'USDC',
            name: 'USD Coin',
            icon: '💵',
            decimals: 6,
            solana: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
            sepolia: '0x9278e9d9ed88E631285B0F1b49d6BB86FEFE9147',
        },
        WSOL: {
            symbol: 'WSOL',
            name: 'Wrapped SOL',
            icon: '◎',
            decimals: 9,
            solana: 'So11111111111111111111111111111111111111112',
            sepolia: '0x824CB8fC742F8D3300d29f16cA8beE94471169f5',
        },
        USDT: {
            symbol: 'USDT',
            name: 'Tether USD',
            icon: '💲',
            decimals: 6,
            solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
            sepolia: null, // Not available on Sepolia yet
        },
    },

    // Wormhole Configuration
    WORMHOLE: {
        NETWORK: 'Testnet',
    },

    // UI Configuration
    UI: {
        DEFAULT_AMOUNT: '1',
        MIN_AMOUNT: '0.1',
        MAX_DECIMALS: 6,
        TRANSACTION_TIMEOUT: 1200000, // 20 minutes
    },

    // External Links
    LINKS: {
        USDC_FAUCET: 'https://faucet.circle.com/',
        SEPOLIA_FAUCET: 'https://sepoliafaucet.com/',
        PHANTOM_DOWNLOAD: 'https://phantom.app/',
        METAMASK_DOWNLOAD: 'https://metamask.io/',
        WORMHOLE_DOCS: 'https://docs.wormhole.com/',
    },
};

// Chain display information
export const CHAIN_INFO = {
    Solana: {
        name: 'Solana',
        logo: '◎',
        color: '#14F195',
        gradient: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
    },
    Sepolia: {
        name: 'Sepolia',
        logo: '⟠',
        color: '#627EEA',
        gradient: 'linear-gradient(135deg, #627EEA 0%, #8A9FF5 100%)',
    },
};

// Transaction states
export const TRANSFER_STATES = {
    CREATED: 'Created',
    SOURCE_INITIATED: 'Source Initiated',
    SOURCE_FINALIZED: 'Source Finalized',
    ATTESTED: 'Attested',
    DEST_INITIATED: 'Destination Initiated',
    DEST_FINALIZED: 'Destination Finalized',
    COMPLETED: 'Completed',
};
