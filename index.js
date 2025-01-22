const { devConnection } = require('./connection');
const { createWallet, getWallet, getWalletBalance} = require('./wallet-utils/wallet');
const { createToken, mintToken, getTokenBalance} = require('./coin-maker/token');
 const {getDevWallet, getDevWalletKeyPair} = require("./dev/devWalletUtil");
 const {PublicKey} = require("@solana/web3.js");
const {transferTokens} = require("./coin-maker/tokeDisturbution");



async function main() {
  const  connection = await devConnection();
  const wallet = await getDevWallet();


  const token = await createToken(connection,wallet);
  const mintedToken = await mintToken(connection,await getDevWalletKeyPair(),token,1000);
  console.log(mintedToken.toBase58());


  await transferTokens(connection,await getDevWalletKeyPair(),mintedToken.toBase58(),
      "4F2feGUj1nDnAzYcSLwbvwLAZxtUMQct2ZSzWoJtB81c",
      100);
  console.log(await getTokenBalance(connection, mintedToken, new PublicKey("4F2feGUj1nDnAzYcSLwbvwLAZxtUMQct2ZSzWoJtB81c")));
  console.log(await getTokenBalance(connection, mintedToken,
      new PublicKey(wallet.publicKey.toBase58().toString())));

  // console.log((await createWallet()).publicKey.toBase58().toString());  4F2feGUj1nDnAzYcSLwbvwLAZxtUMQct2ZSzWoJtB81c











  }

main();