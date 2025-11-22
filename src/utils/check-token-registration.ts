import { wormhole, Wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { getSigner } from "./helpers/index.js";
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_MINT = '7its2mbyAZNnxyEiJqP1jgowtvQzLaBDVQNL5aWZh4QX';

async function checkTokenRegistration() {
    try {
        const wh = await wormhole("Testnet", [evm, solana]);
        const sepoliaChain = wh.getChain("Sepolia");
        const { signer } = await getSigner(sepoliaChain);

        console.log(`Checking if token ${TOKEN_MINT} is registered on Sepolia...\n`);

        const tokenId = Wormhole.tokenId("Solana", TOKEN_MINT);
        const tokenBridge = await sepoliaChain.getTokenBridge();

        try {
            const wrappedAddress = await tokenBridge.getWrappedAsset(tokenId);
            console.log("✅ Token is already registered on Sepolia!");
            console.log(`Wrapped address: ${wrappedAddress.toString()}\n`);
            console.log("You can proceed with the transfer:");
            console.log(`npx tsx src/token-transfer.ts Testnet Solana Sepolia ${TOKEN_MINT} 1`);
        } catch (error: any) {
            if (error.message && error.message.includes("not a wrapped asset")) {
                console.log("❌ Token is NOT registered on Sepolia yet.");
                console.log("\nYou need to register (attest) the token first:");
                console.log(`npx tsx src/create-wrapped-token.ts Testnet Solana ${TOKEN_MINT} Sepolia`);
                console.log("\nNote: Based on previous experience, the registration may fail on Sepolia testnet.");
                console.log("This is a known limitation we encountered earlier.");
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

checkTokenRegistration();
