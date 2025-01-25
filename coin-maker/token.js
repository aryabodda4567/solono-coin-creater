const { createMint, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
const { getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const { PublicKey } = require("@solana/web3.js");
const { createUmi } = require( '@metaplex-foundation/umi-bundle-defaults');
const decimals = 9; // Number of decimal places


const {
  Connection,

  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');
const {
  createCreateMetadataAccountV2Instruction,
  DataV2, createCreateMetadataAccountV3Instruction,
} = require('@metaplex-foundation/mpl-token-metadata');
const fs = require('fs');




/**
 * Creates a new SPL token with associated metadata and mints a specified amount to a destination wallet.
 *
 * @param {Connection} connection - Connection to the Solana network.
 * @param {Keypair} payer - Keypair responsible for paying transaction fees.
 * @param {Keypair} mintAuthority - Keypair that will have authority to mint new tokens.
 * @param {Keypair} freezeAuthority - Keypair that will have authority to freeze token accounts.
 * @param {number} decimals - Number of decimal places for the token.
 * @param {Object} tokenData - Metadata for the token.
 * @param {string} tokenData.name - Name of the token.
 * @param {string} tokenData.symbol - Symbol representing the token.
 * @param {string} tokenData.imageURI - URI pointing to the token's image.
 * @param {Keypair} destinationWallet - Keypair of the wallet to receive the minted tokens.
 * @param {number} amount - Amount of tokens to mint (before adjusting for decimals).
 */

// Function to create a new token with metadata and mint tokens to a specified address
async function createTokenWithMetadataAndMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals,
    tokenData,
    destinationWallet,
    amount
) {
  try {
    // Step 1: Create the new token mint
    const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        decimals
    );
    console.log('Token Mint Address:', mint.toBase58());

    // Step 2: Create the associated token account for the destination wallet
    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        destinationWallet.publicKey
    );

    // Step 3: Mint the specified amount of tokens to the destination token account
    await mintTo(
        connection,
        payer,
        mint,
        destinationTokenAccount.address,
        mintAuthority,
        amount * Math.pow(10, decimals)
    );
    console.log(`Minted ${amount} tokens to ${destinationWallet.publicKey.toBase58()}`);

    // Step 4: Create metadata for the token
    const  TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

    const metadataData = {
      name: "Olawale dev",
      symbol: "OLAWALE",
      // Paste in your JSON file Arweave link using Metaplex standard for off-chain data
      uri: "https://firebasestorage.googleapis.com/v0/b/paper-trading-app-e574a.appspot.com/o/metadata.json?alt=media&token=14e21806-1d95-472f-9c55-f1cad3e569bf",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };


    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );

    const metadataPDA = metadataPDAAndBump[0];

    const transaction = new Transaction();

    const createMetadataAccountInstruction =
        createCreateMetadataAccountV3Instruction(
            {
              metadata: metadataPDA,
              mint: mint,
              mintAuthority: mintAuthority.publicKey,
              payer: payer.publicKey,
              updateAuthority: mintAuthority.publicKey
            },
            {
              createMetadataAccountArgsV3: {
                collectionDetails: null,
                data: metadataData,
                isMutable: true,
              },
            }
        );

    transaction.add(createMetadataAccountInstruction);
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    );

    console.log('Metadata created successfully');
    return mint;
  } catch (error) {
    console.error('Error creating token with metadata and minting:', error);
    throw error;
  }
}


































async function getTokenBalance(connection, tokenMintAddress, walletAddress) {

  try {

    const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMintAddress,
        walletAddress,
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



module.exports = { createTokenWithMetadataAndMint,  getTokenBalance };