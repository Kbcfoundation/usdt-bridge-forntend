import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BiSolidDownArrow } from "react-icons/bi";
import Logo from "../public/Logo.svg";

import React, { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Web3 from "web3";
import { ApproveToken } from "@/components/Approve";
import { Bridgebutton } from "@/components/bridgebutton";
import usdt from "../public/usdt.png";
import { useConnect, useAccount } from "wagmi";
import Footer from "@/components/Footer";
//import { abi } from "../ABI/abi.json";

const inter = Inter({ subsets: ["latin"] });

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensUnlocked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenupdate",
        type: "address",
      },
    ],
    name: "Tokenupdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "lockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_resiver",
        type: "address",
      },
    ],
    name: "unlockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

/* const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "lockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensUnlocked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenupdate",
        type: "address",
      },
    ],
    name: "Tokenupdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_resiver",
        type: "address",
      },
    ],
    name: "unlockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
*/
// Assume you have a function to check the allowance from your contract
async function checkAllowance() {
  // Get user's address from Web3 provider
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  const userAddress = accounts[0];

  // Contract address and ABI for your USDT token contract
  const usdtContractAddress = "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"; // Replace with your USDT token contract address
  const usdtContractABI = [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "_decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ]; // Replace with your USDT token contract ABI

  const usdtContractABIs = [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "_decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ]; // Replace with your USDT token contract ABI

  //const Tokenabi = require("../ABI/tokenABI.json");

  /* // Initialize Web3
  const web3 = new Web3(window.ethereum);

  // Instantiate USDT token contract
  const usdtContract = new web3.eth.Contract(
    usdtContractABI,
    usdtContractAddress
  );

  // Get allowance for your contract from the user's USDT tokens
  const allowance = await usdtContract.methods
    .allowance(userAddress, "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61")
    .call();

  return allowance; */
}

export default function Home({ sendDataToParent }) {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  // const Tokenabi = require("../ABI/tokenABI.json");
  const {
    data: hash,
    writeContract,
    isPending,
    isSuccess,
  } = useWriteContract();
  const [value, setValue] = useState("");
  const [topname, settopName] = useState("BSC");
  const [downname, setdownName] = useState("KDC");
  const [connectedNetwork, setConnectedNetwork] = useState(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (window.ethereum) {
          // Wait for the Ethereum provider to be connected
          await window.ethereum.enable();

          // Access the chainId property for the chain ID
          const chainId = window.ethereum.chainId;
          setConnectedNetwork(chainId);
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    };

    // Initial check on component mount
    checkNetwork();

    // Set up interval to refresh every 1 second
    const intervalId = setInterval(checkNetwork, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means it only runs on mount and unmount

  console.log("main", connectedNetwork);

  useEffect(() => {
    // Check the value of connectedNetwork and set networkName accordingly
    switch (connectedNetwork) {
      case "0x2af8": //kcb
        settopName("KBC");
        setdownName("BSC");
        break;
      case "0x38": //bsc
        settopName("BSC");
        setdownName("KBC");

        break;

      // Add cases for other chains
      // ...
      default:
      // Handle other cases if needed
    }
  }, [connectedNetwork]); // Run this effect whenever connectedNetwork changes

  /*const [contractaddress, setcontractaddress] = useState(
    "0x617c5814f9c52e3768FD233088A01cc6dE25c58A"
  );
  const [tokenaddress, settokenaddress] = useState(
    "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"
  );
*/
  //const [isApproved, setIsApproved] = useState(false);

  /*useEffect(() => {
    async function fetchData() {
      const allowance = await checkAllowance();
      setIsApproved(allowance > 0);
    }

    fetchData();
  }, []); */

  const handleswapButtonClick = () => {
    /*setcontractaddress(
      contractaddress == "0x617c5814f9c52e3768FD233088A01cc6dE25c58A"
        ? "0xBD933Db03dA178059079590B50b8e2bbE09313b0"
        : "0x617c5814f9c52e3768FD233088A01cc6dE25c58A"
    );

    settokenaddress(
      tokenaddress === "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"
        ? "0x563574f776D4537767Caf3E93494028F1CfF3368"
        : "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"
    ); */
    // Toggle between 'sai' and 'satya' based on the current state
    settopName(topname === "BSC" ? "KbC" : "BSC");
    setdownName(downname == "KBC" ? "BSC" : "KBC");
  };

  const handleApprove = async () => {
    try {
      await writeContract({
        usdtContractABIs,
        address: "0xf3100FbB3BD5a6802eC9f15Eaf115E95F1116F87", // `0x${tokenaddress}`, //tokenAddress,//"0x9b2cbE8Ad90fAB7362C6eC5A4896C7629CAe3D16", //token address
        functionName: "approve",
        args: [
          "0xf3100FbB3BD5a6802eC9f15Eaf115E95F1116F87", // contract address

          BigInt(weiAmount),
        ],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });

      // Handle success if needed
      console.log("Approval successful!");
    } catch (error) {
      // Handle error if needed
      console.error("Error during approval:", error);
    }
  };

  // Calculate the multiplier based on the number of decimals
  const multiplier = 10 ** 18;

  // Multiply the token amount by the multiplier to get the amount in Wei
  const weiAmount = BigInt(value) * BigInt(multiplier);
  // const BigweiAmount = BigInt(weiAmount);
  const BigweiAmount = parseInt([BigInt(weiAmount)], 10); // Parse to integer (base 10)

  const handleClick = async () => {
    /*const recipientsArray = recipientsText
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address !== ""); */

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);

    try {
      const decimals = 18;
      //const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0xf3100FbB3BD5a6802eC9f15Eaf115E95F1116F87", // "0x9A9bc340103C462365Db54E423f95784C664d3Df", // "0xBD933Db03dA178059079590B50b8e2bbE09313b0", // KCB BRIDGE CONTRACT
        functionName: "lockTokens",
        args: [BigInt(weiAmount)], //[ BigInt(value * 18)],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(BigInt(value * 10 ** decimals));

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log(" successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };

  const handleClick2 = async () => {
    /*const recipientsArray = recipientsText
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address !== ""); */

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);

    try {
      const decimals = 18;
      //const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0xf3100FbB3BD5a6802eC9f15Eaf115E95F1116F87", // "0xC5052054DBDC35f84D279CB321bE98480d807f6F", // "0x617c5814f9c52e3768FD233088A01cc6dE25c58A", //BSC BRIDGE
        functionName: "lockTokens",
        args: [BigInt(weiAmount)], //[ BigInt(value * 18)],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(BigInt(value * 10 ** decimals));

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log(" successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };

  const handleClickfack = async () => {
    /*const recipientsArray = recipientsText
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address !== ""); */

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);

    try {
      const decimals = 18;
      //const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0xC5052054DBDC35f84D279CB321bE98480d807f6F", // "0x617c5814f9c52e3768FD233088A01cc6dE25c58A",
        functionName: "lockTokens",
        args: [BigInt(weiAmount)], //[ BigInt(value * 18)],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(BigInt(value * 10 ** decimals));

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log(" successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };

  //  logo === 1055 <div className="w-10 h-10 rounded-full p-1 bg-[#212325] flex justify-center items-center"></div>  bg-[#17161b] //dark:bg-gray-800
  // bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-black-900

  /**
   *      <img
                src="https://flowbite.com/docs/images/logo.svg"
                class="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />

               <img
                      src="https://flowbite.com/docs/images/logo.svg"
                      class="h-8 me-3"
                      alt="FlowBite Logo"
                    />
   */
  return (
    <>
      <header>
        <nav class="px-4 lg:px-6 py-2.5  dark:bg-black-900">
          <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="" class="flex items-center">
              <img
                src="./KBClogo.png"
                class="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />

              <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"></span>
            </a>
            <div class="flex items-center lg:order-2">
              <a
                href="#"
                class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              ></a>
              <a
                href="#"
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              ></a>
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  class="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                    aria-current="page"
                  ></a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  ></a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  ></a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  ></a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  ></a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  ></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="bg-[#17161b] h-screen flex justify-center items-center py-10 px-4">
          <div className="bg-[#252027] rounded-xl p-4 max-w-3xl w-full mx-auto border border-blue-500 border-solid border-4 ">
            <div className="bg-[#353037] rounded-lg p-3 border ">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[#bab6bc] font-normal text-sm">
                      From
                    </span>
                    <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                      <p>{topname}</p>
                      <BiSolidDownArrow className="text-xs" />
                    </div>
                  </div>
                </div>

                <div className="text-[#f0e9fc] text-base">
                  <ConnectButton />
                </div>
              </div>

              <div className="border rounded p-2 border-[#4d484f] mt-5 flex gap-3">
                <div className="w-32 rounded p-2 bg-[#565158] h-12 flex items-center gap-3 relative">
                  <div className="w-7 h-7 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                    <Image
                      src={"/usdt.png"}
                      alt="Example Image"
                      width={500}
                      height={300}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                      <p>USDT</p>
                      <BiSolidDownArrow className="text-xs" />
                    </div>
                  </div>
                </div>
                <input
   
   type="number"

                  placeholder="0.00000"
                  className="bg-transparent flex-1 outline-none border-none text-base text-[#ebefe9]"
                  value={value}
                 onChange={(e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.indexOf('.') === -1 && parseInt(inputValue) >= 1) {
        setValue(inputValue);
    }
}}
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button onClick={handleswapButtonClick}>
                {" "}
                <Image
                  src="data:image/svg+xml;base64,PHN2ZyBpZD0iU3ZnanNTdmcxMDI2IiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmNvbS9zdmdqcyI+PGRlZnMgaWQ9IlN2Z2pzRGVmczEwMjciPjwvZGVmcz48ZyBpZD0iU3ZnanNHMTAyOCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2Ij48cGF0aCBkPSJNMTQgMi4yNTZWMzBjLTIuMjA5IDAtNC0xLjc5MS00LTRWMTNINC43MTRjLS42MzMgMC0uOTQ5LS43NjUtLjUwMi0xLjIxMmw5LjYwNy05LjYwN0MxMy44ODYgMi4xMTQgMTQgMi4xNjIgMTQgMi4yNTZ6TTI3Ljc4OCAyMC4yMTJsLTkuNiA5LjZDMTguMTE4IDI5Ljg4MiAxOCAyOS44MzIgMTggMjkuNzM0VjJjMi4yMDkgMCA0IDEuNzkxIDQgNHYxM2g1LjI4NkMyNy45MTggMTkgMjguMjM1IDE5Ljc2NSAyNy43ODggMjAuMjEyeiIgZmlsbD0iIzM0YTg1MyIgY2xhc3M9ImNvbG9yMDAwIHN2Z1NoYXBlIj48L3BhdGg+PC9zdmc+PC9nPjwvc3ZnPg=="
                  alt="Example Image"
                  width={50}
                  height={30}
                />
              </button>
            </div>

            <div className="bg-[#353037] rounded-lg p-3 my-5">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[#bab6bc] font-normal text-sm">To</span>
                  <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                    <p>{downname}</p>
                    <BiSolidDownArrow className="text-xs" />
                  </div>
                </div>
              </div>

              <div className="border rounded p-2 border-[#4d484f] mt-5 flex gap-3">
                <div className="w-32 rounded p-2 bg-[#565158] h-12 flex items-center gap-3 relative">
                  <div className="w-7 h-7 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                    <Image
                      src={"/usdt.png"}
                      alt="Example Image"
                      width={50}
                      height={30}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                      <p>USDT</p>
                      <BiSolidDownArrow className="text-xs" />
                    </div>
                  </div>
                </div>
                <input

   type="number"

                  placeholder="0.00000"
                  className="bg-transparent flex-1 outline-none border-none text-base text-[#ebefe9]"
                  value={value}
                 onChange={(e) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue.indexOf('.') === -1 && parseInt(inputValue) >= 1) {
        setValue(inputValue);
    }
}}
                />
              </div>
            </div>

            <div>
              {/* <p className="text-[#78737b] text-base font-medium">
            Will also receive .0003 <span className="text-[#fcfafd]">ETH</span>{" "}
            ($0..49)
          </p> */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-[#78737b] text-base font-medium"></p>

                  <span className="text-[#fcfafd] text-base font-medium"></span>
                </div>
                <div>
                  <span className="text-[#78737b] text-base font-medium">
                    {" "}
                  </span>
                  <span className="text-[#fcfafd] text-base font-medium"></span>
                </div>
              </div>

              <div className="text-[#78737b] text-base font-medium flex justify-between items-center mt-2">
                <span></span>
              </div>

              <div>
                <div>
                  <ApproveToken weiAmount={BigweiAmount} />

                  <button
                    className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
                    onClick={
                      connectedNetwork === "0x2af8" ? handleClick : handleClick2
                    }
                  >
                    Bridge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <footer class="bg-[#17161b]">
            <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
              <div class="md:flex md:justify-between">
                <div class="mb-6 md:mb-0">
                  <img
                    src="./KBClogo.png"
                    class="mr-3 h-6 sm:h-9"
                    alt="Flowbite Logo"
                  />
                  <a href="" class="flex items-center">
                    <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
                  </a>
                </div>
                <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                      Resources
                    </h2>
                    <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                        <a href="" class="hover:underline">
                          KBC
                        </a>
                      </li>
                      <li>
                        <a href="" class="hover:underline">
                          KBC
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                      Follow us
                    </h2>
                    <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                        <a href="https://github.com/" class="hover:underline ">
                          Github
                        </a>
                      </li>
                      <li>
                        <a href="https://discord.gg/" class="hover:underline">
                          Discord
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                      Legal
                    </h2>
                    <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                        <a href="#" class="hover:underline">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="#" class="hover:underline">
                          Terms &amp; Conditions
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
              <div class="sm:flex sm:items-center sm:justify-between">
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                  © 2024{" "}
                  <a href="" class="hover:underline">
                    KBC™
                  </a>
                  . All Rights Reserved.
                </span>
                <div class="flex mt-4 sm:justify-center sm:mt-0">
                  <a
                    href="#"
                    class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 8 19"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="sr-only">Facebook page</span>
                  </a>
                  <a
                    href="#"
                    class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
                  >
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 21 16"
                    >
                      <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                    </svg>
                    <span class="sr-only">Discord community</span>
                  </a>
                  <a
                    href="#"
                    class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
                  >
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 17"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="sr-only">Twitter page</span>
                  </a>
                  <a
                    href="#"
                    class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
                  >
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="sr-only">GitHub account</span>
                  </a>
                  <a
                    href="#"
                    class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
                  >
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="sr-only">Dribbble account</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

// bg-white dark:bg-gray-900
// Expected Price on   //  Slippage

/**
 *  <ApproveToken weiAmount={weiAmount} />

              <button
                className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
                onClick={
                  connectedNetwork === "0x2af8" ? handleClick : handleClick2
                }
              >
                Bridge
              </button>

               {isSuccess && <div>{hash}</div>}
 */

// onClick={connectedNetwork === "0x2af8" ? handleClick : handleClick2}

/**        
          <div>
            {!isApproved ? (
               
                <button
                    className="w-full bg-[#2d282f] text-[#555057] font-medium text-center p-[10px] rounded-xl mt-7"
                    onClick={handleClick}
                >
                    Bridge ETH
                </button>
            ) : (
                <button
                    className="w-full bg-[#2d282f] text-[#555057] font-medium text-center p-[10px] rounded-xl mt-7"
                    onClick={handleApprove}
                >
                    Approval
                </button>
            )}
        </div>  */
