import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { createMetadataAccountV3 } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import dotenv from 'dotenv';
import bs58 from 'bs58';

dotenv.config();

async function main() {
    // 1. Setup Connection and Keypair
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

    console.log("Payer address:", payer.publicKey.toBase58());

    // 2. Create Mint
    console.log("Creating Mint...");
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey, // mint authority
        payer.publicKey, // freeze authority
        9 // decimals
    );
    console.log("Mint created:", mint.toBase58());

    // 3. Create Associated Token Account
    console.log("Creating Associated Token Account...");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );
    console.log("Token Account:", tokenAccount.address.toBase58());

    // 4. Mint Tokens
    console.log("Minting tokens...");
    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer.publicKey,
        1000 * 10 ** 9 // 1000 tokens
    );
    console.log("Minted 1000 tokens.");

    // Wait for propagation
    console.log("Waiting 5 seconds for propagation...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    /*
    // 5. Add Metadata using Umi
    console.log("Adding Metadata...");
    const umi = createUmi(clusterApiUrl('devnet'));

    console.log("Web3 Connection Endpoint:", connection.rpcEndpoint);
    console.log("Umi RPC Endpoint:", umi.rpc.getEndpoint());

    const umiKeypair = fromWeb3JsKeypair(payer);
    const umiSigner = createSignerFromKeypair(umi, umiKeypair);
    umi.use(signerIdentity(umiSigner));

    const mintPubkey = fromWeb3JsPublicKey(mint);
    console.log("Mint Pubkey (Web3):", mint.toBase58());
    console.log("Mint Pubkey (Umi):", mintPubkey);

    let mintAccount = await umi.rpc.getAccount(mintPubkey);
    let retries = 0;
    while (!mintAccount.exists && retries < 30) {
        console.log("Mint account not found on Umi RPC, waiting...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        mintAccount = await umi.rpc.getAccount(mintPubkey);
        retries++;
    }

    console.log("Mint Account Exists:", mintAccount.exists);
    if (mintAccount.exists) {
        console.log("Mint Account Owner:", mintAccount.owner);
        console.log("Mint Account Data Length:", mintAccount.data.length);
    } else {
        console.error("Mint Account does not exist on Umi RPC after retries!");
        return;
    }

    const tx = await createMetadataAccountV3(umi, {
        mint: mintPubkey,
        mintAuthority: umiSigner,
        payer: umiSigner,
        data: {
            name: "Test Token",
            symbol: "TEST",
            uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json", // Sample metadata
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        },
        isMutable: true,
        collectionDetails: null,
    }).sendAndConfirm(umi);

    console.log("Metadata added successfully.");
    console.log(`Explorer Link: https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`);
    */
    console.log(`Explorer Link: https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`);
}

main().catch(console.error);
