const { getWallet, getKeyPair } = require("../wallet-utils/wallet");

async function getDevWallet() {
    try {
        const privateKey = process.env.PRIVATE_KEY;
        const privateKeyArray = JSON.parse(privateKey);
        return await getWallet(privateKeyArray);
    } catch (error) {
        console.error("Error getting dev wallet:", error);
        throw error;
    }
}

async function getDevWalletKeyPair() {
    try {
        const privateKey = process.env.PRIVATE_KEY;
        const privateKeyArray = JSON.parse(privateKey);
        return await getKeyPair(privateKeyArray);
    } catch (error) {
        console.error("Error getting dev wallet keypair:", error);
        throw error;
    }
}

module.exports = { getDevWallet, getDevWalletKeyPair };