const {
    Connection,
    PublicKey,
    Keypair,
    clusterApiUrl,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');
const {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
} = require('@solana/spl-token');

// Function to transfer SPL tokens
async function transferTokens(
    connection,
    payer, // Keypair of the sender
    mintAddressArg, // PublicKey of the token mint
    recipientPublicKeyArg, // PublicKey of the recipient
    amount // Number of tokens to send (adjusted for decimals)
) {
    try {
        const mintAddress = new PublicKey(mintAddressArg);
        const recipientPublicKey = new PublicKey(recipientPublicKeyArg);

        // Get the sender's associated token account
        const senderTokenAddress = await getAssociatedTokenAddress(
            mintAddress,
            payer.publicKey
        );

        // Get the recipient's associated token account
        const recipientTokenAddress = await getAssociatedTokenAddress(
            mintAddress,
            recipientPublicKey
        );

        const transaction = new Transaction();

        // Check if the recipient's token account exists
        const recipientAccountInfo = await connection.getAccountInfo(
            recipientTokenAddress
        );
        if (recipientAccountInfo === null) {
            // If not, create the associated token account for the recipient
            const createAccountIx = await createAssociatedTokenAccountInstruction(
                payer.publicKey,
                recipientTokenAddress,
                recipientPublicKey,
                mintAddress
            );
            transaction.add(createAccountIx);
        }

        // Create the transfer instruction
        const transferIx = await createTransferInstruction(
            senderTokenAddress,
            recipientTokenAddress,
            payer.publicKey,
            amount * Math.pow(10, 9) // Adjust amount for decimals
        );

        transaction.add(transferIx);

        // Send the transaction
        await sendAndConfirmTransaction(connection, transaction, [payer]);

        console.log(
            `Transferred ${amount} tokens to ${recipientTokenAddress.toBase58()}`
        );
    } catch (error) {
        console.error("Error transferring tokens:", error);
        throw error;
    }
}

module.exports = { transferTokens };