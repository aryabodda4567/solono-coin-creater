const { Keypair } = require('@solana/web3.js');
const solanaWeb3 = require("@solana/web3.js");

async function createWallet() {
    try {
        return Keypair.generate();
    } catch (error) {
        console.error("Error creating wallet:", error);
        throw error;
    }
}

async function getWallet(secretKeyArray) {
    try {
        const secretKey = Uint8Array.from(secretKeyArray);
        return Keypair.fromSecretKey(secretKey);
    } catch (error) {
        console.error("Error getting wallet from secret key:", error);
        throw error;
    }
}

async function getKeyPair(privateKeyArray) {
    try {
        const secretKey = Uint8Array.from(privateKeyArray);
        return Keypair.fromSecretKey(secretKey);
    } catch (error) {
        console.error("Error getting keypair from private key:", error);
        throw error;
    }
}

async function getWalletBalance(connection, publicKey) {
    try {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
        console.log(`Wallet balance: ${solBalance} SOL`);
        return solBalance;
    } catch (error) {
        console.error(`Error fetching balance: ${error}`);
        return null;
    }
}

module.exports = { createWallet, getWallet, getWalletBalance, getKeyPair };