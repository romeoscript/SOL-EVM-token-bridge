
import { Wormhole, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";

async function getWrappedAddress() {
    try {
        const wh = await wormhole("Testnet", [evm, solana]);

        // Origin Chain (Solana)
        const origChain = wh.getChain("Solana");
        // Native SOL on Solana is represented by the WSOL mint for bridging purposes usually,
        // or the bridge handles 'native'. 
        // Let's try using the WSOL address explicitly if 'native' fails the check.
        // Solana Testnet WSOL: So11111111111111111111111111111111111111112
        const token = Wormhole.tokenId(origChain.chain, "So11111111111111111111111111111111111111112");

        // Destination Chain (Sepolia)
        const destChain = wh.getChain("Sepolia");
        const tb = await destChain.getTokenBridge();

        // Get the wrapped asset address
        const wrapped = await tb.getWrappedAsset(token);

        console.log("---------------------------------------------------");
        console.log("Wrapped SOL Address on Sepolia:", wrapped);
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error("Error fetching wrapped address:", error);
    }
}

getWrappedAddress();
