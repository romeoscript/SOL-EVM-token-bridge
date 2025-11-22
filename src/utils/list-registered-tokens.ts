import { wormhole, Wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import dotenv from 'dotenv';

dotenv.config();

// Common testnet tokens to check
const TESTNET_TOKENS = [
    { name: "USDC", address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" },
    { name: "Wrapped SOL", address: "So11111111111111111111111111111111111111112" },
    { name: "USDT", address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
];

async function checkRegisteredTokens() {
    try {
        const wh = await wormhole("Testnet", [evm, solana]);
        const sepoliaChain = wh.getChain("Sepolia");

        console.log("Checking which tokens are registered on Sepolia...\n");
        console.log("=".repeat(70));

        const registered = [];
        const notRegistered = [];

        for (const token of TESTNET_TOKENS) {
            console.log(`\n${token.name}: ${token.address}`);
            console.log("-".repeat(70));

            try {
                const tokenId = Wormhole.tokenId("Solana", token.address);
                const tokenBridge = await sepoliaChain.getTokenBridge();
                const wrappedAddress = await tokenBridge.getWrappedAsset(tokenId);

                console.log("✅ REGISTERED on Sepolia");
                console.log(`   Wrapped address: ${wrappedAddress.toString()}`);

                registered.push({
                    name: token.name,
                    solanaAddress: token.address,
                    sepoliaAddress: wrappedAddress.toString()
                });

            } catch (error: any) {
                if (error.message && error.message.includes("not a wrapped asset")) {
                    console.log("❌ NOT registered on Sepolia");
                    notRegistered.push(token.name);
                } else {
                    console.log(`⚠️  Error: ${error.message}`);
                }
            }
        }

        // Summary
        console.log("\n" + "=".repeat(70));
        console.log("\n📊 SUMMARY\n");

        console.log(`✅ Registered (${registered.length}):`);
        registered.forEach(t => {
            console.log(`   - ${t.name}`);
            console.log(`     Solana: ${t.solanaAddress}`);
            console.log(`     Sepolia: ${t.sepoliaAddress}`);
        });

        console.log(`\n❌ Not Registered (${notRegistered.length}):`);
        notRegistered.forEach(name => console.log(`   - ${name}`));

        console.log("\n" + "=".repeat(70));
        console.log("\n💡 To bridge a registered token:");
        console.log("   npm run bridge Testnet Solana Sepolia <token-address> <amount>");

    } catch (error) {
        console.error("Error:", error);
    }
}

checkRegisteredTokens();
