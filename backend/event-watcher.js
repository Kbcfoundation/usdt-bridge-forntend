const Web3 = require("web3");

//load env file
require("dotenv").config();

const {
  unlockonbsc,
  unlock,
  mintTokens,
  approveForBurn,
  burnTokens,
  transferToEthWallet,
} = require("./contract-methods.js");

const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS;
const DESTINATION_TOKEN_CONTRACT_ADDRESS =
  process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS;
const BRIDGE_WALLET = process.env.BRIDGE_WALLET;

const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY;

const CHSD_ABIJSON = require("./ChainstackDollars.json");
const QCHSD_ABIJSON = require("./DChainstackDollars.json");

const handleEthEvent = async (event, provider, contract) => {
  console.log("handleEthEvent");
  const { sender, amount } = event.returnValues;
  console.log("to :>> ");
  console.log("from :>> ", sender);
  console.log("value :>> ", amount);
  console.log("============================");

  /*if (from == BRIDGE_WALLET) {
    console.log("Transfer is a bridge back");
    return;
  } */
  if (1 == 1) {
    // (to == BRIDGE_WALLET && to != sender) {
    console.log("Tokens received on bridge from bsc chain! Time to bridge!");

    try {
      const tokensMinted = await unlock(provider, contract, amount, sender);
      if (!tokensMinted) return;
      console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
    } catch (err) {
      console.error("Error processing transaction", err);
      // TODO: return funds
    }
  } else {
    console.log("Another transfer");
  }
};

const handleDestinationEventunlock = async (event, provider, contract) => {
  console.log("handleEthEvent");
  const { sender, amount } = event.returnValues;
  console.log("to :>> ", sender);
  console.log("from :>> ");
  console.log("value :>> ", amount);
  console.log("============================");

  /*  if (from == BRIDGE_WALLET) {
    console.log("Transfer is a bridge back");
    return;
  } */
  if (1 == 1) {
    // (to == BRIDGE_WALLET && to != sender) {
    console.log("Tokens received on bridge from bsc chain! Time to bridge!");

    try {
      const tokensMinted = await unlockonbsc(
        provider,
        contract,
        amount,
        sender
      );
      if (!tokensMinted) return;
      console.log("🌈🌈🌈🌈🌈 Bridge to destination completed");
    } catch (err) {
      console.error("Error processing transaction", err);
      // TODO: return funds
    }
  } else {
    console.log("Another transfer");
  }
};

const main = async () => {
  const originWebSockerProvider = new Web3(process.env.ORIGIN_WSS_ENDPOINT);
  const destinationWebSockerProvider = new Web3(
    process.env.DESTINATION_WSS_ENDPOINT
  );
  // adds account to sign transactions
  originWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);
  destinationWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);

  const oriNetworkId = await originWebSockerProvider.eth.net.getId();
  const destNetworkId = await destinationWebSockerProvider.eth.net.getId();

  console.log("oriNetworkId :>> ", oriNetworkId);
  console.log("destNetworkId :>> ", destNetworkId);

  const originTokenContract = new originWebSockerProvider.eth.Contract(
    CHSD_ABIJSON.abi,
    ORIGIN_TOKEN_CONTRACT_ADDRESS
  );

  const destinationTokenContract =
    new destinationWebSockerProvider.eth.Contract(
      QCHSD_ABIJSON.abi,
      DESTINATION_TOKEN_CONTRACT_ADDRESS
    );

  let options = {
    /*  filter: {
    value: [], //Only get events where transfer value was 1000 or 1337
  },
  fromBlock: 0, //Number || "earliest" || "pending" || "latest"
  toBlock: "latest", */
  };

  originTokenContract.events
    .TokensLocked(options)
    .on("data", async (event) => {
      await handleEthEvent(
        event,
        destinationWebSockerProvider,
        destinationTokenContract
      );
    })
    .on("error", (err) => {
      console.error("Error: ", err);
    });
  console.log(
    `Waiting for Transfer events on ${ORIGIN_TOKEN_CONTRACT_ADDRESS}`
  );

  destinationTokenContract.events
    .TokensLocked(options)
    .on("data", async (event) => {
      await handleDestinationEventunlock(
        event,
        originWebSockerProvider,
        originTokenContract
      );
    })
    .on("error", (err) => {
      console.error("Error: ", err);
    });

  console.log(
    `Waiting for Transfer events on ${DESTINATION_TOKEN_CONTRACT_ADDRESS}`
  );
};

main();
