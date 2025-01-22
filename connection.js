const solanaWeb3 = require('@solana/web3.js');
require('dotenv').config()

async function mainConnection() {
      try {
            // Setting up the connection to Solana RPC via NOWNodes
            return new solanaWeb3.Connection(process.env.PROVIDER_URL,
                'confirmed');
      } catch (error) {
            console.error("Error connecting to mainnet:", error);
            throw error; // Re-throw the error to handle it at a higher level
      }
}

async function devConnection() {
      try {
            return new solanaWeb3.Connection(
                solanaWeb3.clusterApiUrl('devnet'),
                'confirmed'
            );
      } catch (error) {
            console.error("Error connecting to devnet:", error);
            throw error; // Re-throw the error to handle it at a higher level
      }
}

module.exports = { mainConnection, devConnection }