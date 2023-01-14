const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const newPair = new Keypair();
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
console.log("This would be the public key :", publicKey);

const getWalletBalance = async (accountPublicKey) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletBalance = await connection.getBalance(
      new PublicKey(accountPublicKey)
    );
    console.log(
      `Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
    );
  } catch (err) {
    console.log(err);
  }
};

const fromAirDropSignature = async (accountPublicKey, solAmount) => {
  try {
    solAmount = parseInt(solAmount);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    console.log("Airdropping some SOL to my wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(accountPublicKey),
      solAmount * LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(fromAirDropSignature);
  } catch (e) {
    console.log(e);
  }
};

rl.question("Input public key: ", (accountPublicKey) => {
  rl.question("Input amount of sol: ", async (solAmount) => {
    await getWalletBalance(accountPublicKey);
    await fromAirDropSignature(accountPublicKey, solAmount);
    await getWalletBalance(accountPublicKey);
    rl.close();
  });
});
