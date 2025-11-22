import { wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { getSigner } from "../helpers/index.js";
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

async function checkSepoliaUSDC() {
    try {
        const wh = await wormhole("Testnet", [evm, solana]);
        const sepoliaChain = wh.getChain("Sepolia");
        const { signer } = await getSigner(sepoliaChain);
        const address = signer.address();

        console.log(`Checking balances for address: ${address}`);

        // Check ETH balance
        const provider = await sepoliaChain.getRpc();
        const ethBalance = await provider.getBalance(address);
        console.log(`\nETH Balance: ${ethers.formatEther(ethBalance)} ETH`);

        // Get the wrapped USDC token address on Sepolia
        const { Wormhole } = await import("@wormhole-foundation/sdk");
        const usdcToken = Wormhole.tokenId("Solana", "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

        const tokenBridge = await sepoliaChain.getTokenBridge();
        const wrappedToken = await tokenBridge.getWrappedAsset(usdcToken);
        const wrappedTokenAddress = wrappedToken.toString();

        console.log(`\nWrapped USDC address on Sepolia: ${wrappedTokenAddress}`);

        // Create ERC20 contract instance
        const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
            "function name() view returns (string)"
        ];

        const tokenContract = new ethers.Contract(wrappedTokenAddress, erc20Abi, provider);

        const balance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        const name = await tokenContract.name();

        console.log(`Token Name: ${name}`);
        console.log(`Token Symbol: ${symbol}`);
        console.log(`Wrapped USDC Balance: ${ethers.formatUnits(balance, decimals)} ${symbol}`);

    } catch (error) {
        console.error("Error checking balance:", error);
    }
}

checkSepoliaUSDC();
