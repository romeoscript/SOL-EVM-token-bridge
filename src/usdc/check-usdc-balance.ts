import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import dotenv from 'dotenv';
import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';

dotenv.config();

const USDC_MINT_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

async function checkUSDCBalance() {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        const privateKey = process.env.SOL_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("SOL_PRIVATE_KEY not found in .env");
        }

        let secretKey: Uint8Array;
        try {
            secretKey = new Uint8Array(JSON.parse(privateKey));
        } catch (e) {
            secretKey = bs58.decode(privateKey);
        }
        const payer = Keypair.fromSecretKey(secretKey);

        console.log("Wallet address:", payer.publicKey.toBase58());

        const usdcMint = new PublicKey(USDC_MINT_DEVNET);
        const associatedTokenAddress = await getAssociatedTokenAddress(
            usdcMint,
            payer.publicKey
        );

        console.log("USDC Token Account:", associatedTokenAddress.toBase58());

        try {
            const tokenAccount = await getAccount(connection, associatedTokenAddress);
            const balance = Number(tokenAccount.amount) / 1e6; // USDC has 6 decimals
            console.log(`USDC Balance: ${balance} USDC`);

            if (balance === 0) {
                console.log("\nYou don't have any USDC. You can get testnet USDC from:");
                console.log("- Solana Faucet: https://faucet.solana.com/");
                console.log("- Circle Faucet: https://faucet.circle.com/");
            }
        } catch (error: any) {
            if (error.name === 'TokenAccountNotFoundError') {
                console.log("USDC token account does not exist yet.");
                console.log("\nYou need to create a token account and get some testnet USDC from:");
                console.log("- Circle Faucet: https://faucet.circle.com/");
            } else {
                throw error;
            }
        }

        // Check SOL balance too
        const solBalance = await connection.getBalance(payer.publicKey);
        console.log(`\nSOL Balance: ${solBalance / 1e9} SOL`);

    } catch (error) {
        console.error("Error:", error);
    }
}

checkUSDCBalance();
