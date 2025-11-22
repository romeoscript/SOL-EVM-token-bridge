/**
 * Centralized configuration for the Solana-EVM Token Bridge
 */

export const TOKENS = {
    USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    WRAPPED_SOL: "So11111111111111111111111111111111111111112",
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
} as const;

export const CHAINS = {
    // Solana
    SOLANA: "Solana",

    // EVM Testnets
    SEPOLIA: "Sepolia",
    ARBITRUM_SEPOLIA: "ArbitrumSepolia",
    BASE_SEPOLIA: "BaseSepolia",
    OPTIMISM_SEPOLIA: "OptimismSepolia",
    POLYGON_SEPOLIA: "PolygonSepolia",
    HOLESKY: "Holesky",
} as const;

export const FAUCETS = {
    SOLANA: "https://faucet.solana.com/",
    USDC: "https://faucet.circle.com/",
    BASE_SEPOLIA: "https://portal.cdp.coinbase.com/products/faucet",
    ARBITRUM_SEPOLIA: "https://faucet.quicknode.com/arbitrum/sepolia",
    OPTIMISM_SEPOLIA: "https://app.optimism.io/faucet",
    POLYGON_SEPOLIA: "https://faucet.polygon.technology/",
} as const;

export const WRAPPED_TOKENS_SEPOLIA = {
    USDC: "0x9278e9d9ed88E631285B0F1b49d6BB86FEFE9147",
    WRAPPED_SOL: "0x824CB8fC742F8D3300d29f16cA8beE94471169f5",
} as const;
