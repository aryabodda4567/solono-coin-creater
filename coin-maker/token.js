const { createMint, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
const { getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const { PublicKey } = require("@solana/web3.js");
const decimals = 9; // Number of decimal places

async function createToken(connection, payer) {
  try {
    const mintAuthority = payer.publicKey;
    const freezeAuthority = payer.publicKey;

    // Create the new token mint
    const mint = await createMint(
        connection,        // Connection to the Solana network
        payer,             // Signer for transaction fees
        mintAuthority,     // Account that will control minting
        freezeAuthority,   // Account that can freeze token accounts
        decimals,
        undefined,
        {},  // Number of decimal places
        TOKEN_PROGRAM_ID   // Program ID of the Token Program
    );

    // console.log('Token Mint Address:', mint.toBase58());
    return mint;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}

async function mintToken(connection, fromWallet, mint, amount) {
  try {
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,          // Connection object
        fromWallet,    // Payer of the transaction
        mint,                // Mint address
        fromWallet.publicKey // Owner of the token account
    );

    await mintTo(
        connection,          // Connection object
        fromWallet,          // Payer of the transaction (Keypair)
        mint,                // Mint address
        fromTokenAccount.address, // Recipient token account address
        fromWallet.publicKey,      // Mint authority
        amount * Math.pow(10, 9)   // Amount to mint (adjusted for decimals)
    );
    return mint;
  } catch (error) {
    console.error("Error minting token:", error);
    throw error;
  }
}

async function getTokenBalance(connection, tokenAddress, walletKey) {
  try {
    const tokenMintAddress = new PublicKey(tokenAddress);
    const walletPublicKey = new PublicKey(walletKey);

    const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMintAddress,
        walletPublicKey,
    );

    // Fetch the account information
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

    if (accountInfo === null) {
      console.log('Associated token account not found.');
      return null;
    }

    // Decode the account data
    const account = await getAccount(connection, associatedTokenAddress);

    // The amount is in the smallest unit (e.g., lamports for SOL)
    const amount = account.amount.toString();
    // console.log(`Token Balance: ${Number(amount) / Math.pow(10, decimals)}`);
    return Number(amount) / Math.pow(10, decimals);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return null;
  }
}

module.exports = { createToken, mintToken, getTokenBalance };