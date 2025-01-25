const { devConnection } = require('./connection');
const { createWallet, getWallet, getWalletBalance} = require('./wallet-utils/wallet');
const { createToken, mintToken, getTokenBalance, createTokenWithMetadataAndMint} = require('./coin-maker/token');
 const {getDevWallet, getDevWalletKeyPair} = require("./dev/devWalletUtil");
 const {PublicKey} = require("@solana/web3.js");
const {transferTokens} = require("./coin-maker/tokeDisturbution");
const {airdrop} = require("./wallet-utils/airdrop");



async function main() {
  const  connection = await devConnection();
  const wallet = await getDevWallet();
  // await  airdrop(connection,wallet.publicKey);
  console.log(Buffer.from(wallet.secretKey).toString('base64'));
  const keyPair = await getDevWalletKeyPair();



    const tokenData  ={}
    const mint =  await createTokenWithMetadataAndMint(connection,keyPair,keyPair,keyPair,9,tokenData,keyPair,1000);


  await transferTokens(connection,await getDevWalletKeyPair(),mint.toBase58(),
      "4F2feGUj1nDnAzYcSLwbvwLAZxtUMQct2ZSzWoJtB81c",
      100);
  console.log(await getTokenBalance(connection, mint, new PublicKey("4F2feGUj1nDnAzYcSLwbvwLAZxtUMQct2ZSzWoJtB81c")));
  console.log(await getTokenBalance(connection, mint, wallet.publicKey));







  }

main();