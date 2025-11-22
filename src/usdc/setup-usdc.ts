import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import dotenv from 'dotenv';
import bs58 from 'bs58';

dotenv.config();

const USDC_MINT_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

async function setupUSDCAccount() {
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

        console.log("Creating or getting USDC token account...");
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            usdcMint,
            payer.publicKey
        );

        console.log("USDC Token Account:", tokenAccount.address.toBase58());
        console.log("Account created successfully!");

        console.log("\n✅ Next steps:");
        console.log("1. Go to Circle's testnet faucet: https://faucet.circle.com/");
        console.log("2. Select 'Solana Devnet'");
        console.log("3. Enter your wallet address:", payer.publicKey.toBase58());
        console.log("4. Request testnet USDC");
        console.log("\nAfter you receive USDC, you can check your balance with:");
        console.log("npx tsx src/check-usdc-balance.ts");
        console.log("\nThen bridge USDC with:");
        console.log("npx tsx src/token-transfer.ts Testnet Solana Sepolia 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU 1");

    } catch (error) {
        console.error("Error:", error);
    }
}

setupUSDCAccount();
