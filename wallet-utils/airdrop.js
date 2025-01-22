const solanaWeb3 = require('@solana/web3.js');


async function airdrop(connection,publicKey) {
    const airdropSignature = await connection.requestAirdrop(
        publicKey,
        solanaWeb3.LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
}

module.exports = { airdrop}



   
  
