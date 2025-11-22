
import { wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { getSigner } from "./helpers/index.js";
import dotenv from 'dotenv';

dotenv.config();

async function checkBalance() {
    try {
        const wh = await wormhole("Testnet", [evm, solana]);
        const chain = wh.getChain("Sepolia");
        const { signer } = await getSigner(chain);
        const address = signer.address();
        
        console.log(`Checking balance for address: ${address}`);
        
        // The signer object might have a getBalance method or we can use the chain provider
        const provider = chain.getRpc();
        const balance = await provider.getBalance(address);
        
        console.log(`Balance (Wei): ${balance.toString()}`);
        console.log(`Balance (ETH): ${Number(balance) / 1e18}`);
        
    } catch (error) {
        console.error("Error checking balance:", error);
    }
}

checkBalance();
