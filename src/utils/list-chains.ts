import { wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import dotenv from 'dotenv';

dotenv.config();

async function listSupportedChains() {
    try {
        const wh = await wormhole("Testnet", [evm, solana]);

        console.log("🌉 Wormhole Testnet - Supported Destination Chains\n");
        console.log("=".repeat(80));

        // EVM Testnets
        const evmTestnets = [
            { name: "Sepolia", description: "Ethereum Testnet" },
            { name: "ArbitrumSepolia", description: "Arbitrum L2 Testnet" },
            { name: "BaseSepolia", description: "Base L2 Testnet (Coinbase)" },
            { name: "OptimismSepolia", description: "Optimism L2 Testnet" },
            { name: "PolygonSepolia", description: "Polygon Testnet" },
            { name: "Holesky", description: "Ethereum Holesky Testnet" },
        ];

        console.log("\n📍 EVM Testnet Chains:\n");
        for (const chain of evmTestnets) {
            try {
                const chainContext = wh.getChain(chain.name as any);
                console.log(`✅ ${chain.name.padEnd(20)} - ${chain.description}`);
            } catch (e) {
                console.log(`❌ ${chain.name.padEnd(20)} - Not available`);
            }
        }

        console.log("\n" + "=".repeat(80));
        console.log("\n💡 Recommendations:\n");

        console.log("🔥 Best Options (L2s - Cheaper Gas):");
        console.log("   1. Base Sepolia    - Backed by Coinbase, very reliable");
        console.log("   2. Arbitrum Sepolia - Popular L2, good faucet support");
        console.log("   3. Optimism Sepolia - Another solid L2 option");

        console.log("\n⚡ Faucets:");
        console.log("   Base Sepolia:     https://portal.cdp.coinbase.com/products/faucet");
        console.log("   Arbitrum Sepolia: https://faucet.quicknode.com/arbitrum/sepolia");
        console.log("   Optimism Sepolia: https://app.optimism.io/faucet");
        console.log("   Polygon Sepolia:  https://faucet.polygon.technology/");

        console.log("\n" + "=".repeat(80));
        console.log("\n📝 How to use a different chain:\n");
        console.log("1. Get testnet ETH from the faucet");
        console.log("2. Check your balance:");
        console.log("   npx tsx src/check-balance.ts");
        console.log("\n3. For pre-registered tokens (USDC, SOL):");
        console.log("   npx tsx src/token-transfer.ts Testnet Solana <ChainName> <token> <amount>");
        console.log("\n4. For custom tokens, register first:");
        console.log("   npx tsx src/create-wrapped-token.ts Testnet Solana <token> <ChainName>");

    } catch (error) {
        console.error("Error:", error);
    }
}

listSupportedChains();
