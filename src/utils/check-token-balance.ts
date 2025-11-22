import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import dotenv from 'dotenv';
import bs58 from 'bs58';

dotenv.config();

const TOKEN_MINT = '7its2mbyAZNnxyEiJqP1jgowtvQzLaBDVQNL5aWZh4QX';

async function checkTokenBalance() {
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
        console.log("Checking token:", TOKEN_MINT);

        const tokenMint = new PublicKey(TOKEN_MINT);

        // Get mint info
        try {
            const mintInfo = await getMint(connection, tokenMint);
            console.log("\nToken Mint Info:");
            console.log("- Decimals:", mintInfo.decimals);
            console.log("- Supply:", mintInfo.supply.toString());
            console.log("- Mint Authority:", mintInfo.mintAuthority?.toBase58() || "None");
            console.log("- Freeze Authority:", mintInfo.freezeAuthority?.toBase58() || "None");
        } catch (error: any) {
            console.error("Error fetching mint info:", error.message);
            console.log("\nThis token might not exist on Solana Devnet.");
            console.log("Please verify the token address is correct and exists on Devnet.");
            return;
        }

        const associatedTokenAddress = await getAssociatedTokenAddress(
            tokenMint,
            payer.publicKey
        );

        console.log("\nToken Account:", associatedTokenAddress.toBase58());

        try {
            const tokenAccount = await getAccount(connection, associatedTokenAddress);
            const balance = Number(tokenAccount.amount);
            const mintInfo = await getMint(connection, tokenMint);
            const decimals = mintInfo.decimals;
            const readableBalance = balance / Math.pow(10, decimals);

            console.log(`\nToken Balance: ${readableBalance} tokens`);
            console.log(`Raw Balance: ${balance}`);

            if (balance === 0) {
                console.log("\nYou don't have any of this token.");
                console.log("You need to acquire some before bridging.");
            } else {
                console.log("\n✅ You have tokens to bridge!");
                console.log("\nNext steps:");
                console.log("1. Register the token on the destination chain (if not already registered)");
                console.log("2. Transfer tokens using:");
                console.log(`   npx tsx src/token-transfer.ts Testnet Solana Sepolia ${TOKEN_MINT} <amount>`);
            }
        } catch (error: any) {
            if (error.name === 'TokenAccountNotFoundError') {
                console.log("\nToken account does not exist for your wallet.");
                console.log("You don't have any of this token.");
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

checkTokenBalance();
