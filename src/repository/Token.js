require("dotenv").config();
const ethers = require("ethers");
// const db=require('../db')
// const mongoose = require("mongoose");
const ico_abi = require("../ABI/Contract.json");
const tokenAbi = require("../ABI/Token.json");
const contract_address = process.env.Contract_address;
const Token_address = process.env.Token_address;
const account = process.env.account;

const privateKey = process.env.privateKey;
const provider = new ethers.providers.JsonRpcProvider(
  process.env.sepolia_network
);

const toEth = (value) => ethers.utils.formatEther(value);
const toWei = (value) => ethers.utils.parseEther(value.toString());
const cors = require("cors");

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contract_address, ico_abi, provider);
const token = new ethers.Contract(Token_address, tokenAbi, provider);
contracWithWallet = contract.connect(wallet);
tokenWithWallet = token.connect(wallet);

// Function That Convert UnixTimeStamp to Data
const toDate = (value) => {
  const unixTimestamp = value;
  const milliseconds = value * 1000;
  const dateObject = new Date(milliseconds);
  const options = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
  };
  const humanDateFormat = dateObject.toLocaleString("en-US", options);
  return humanDateFormat;
};

//call to ico contract= address,usdt
const calculateToken = async (_tokenSent, _account) => {
  if(_tokenSent===0){
    let data={msg:"No token to sent"}
    return data ;
  }
  let usdt = _tokenSent;
  // let calculation = (amount) => amount * 10 ** 6;

  const tx = await contracWithWallet.updateBalance(usdt, _account);

  // const tx = await tokenWithWallet.Owner();
  let event = await tx.wait();
  let data = event.events[0].args;

  // console.log((data[1],data[2],data,));

  let dataDecode = {
    account: data[0],
    sentUsdt: parseInt(data[1]),
    updatedBalance: parseInt(data[2]),
    timestamp: toDate(data[3]),
  };
  console.log("🚀 --------------------------------------------🚀");
  console.log("🚀 ~ calculateToken ~ dataDecode:", dataDecode);
  console.log("🚀 --------------------------------------------🚀");
  return  dataDecode;
};
getStartTime = async () => {
  let startime = await contracWithWallet.startTime();
  let decodeData = parseInt(startime);
  return decodeData;
};
module.exports = { calculateToken, getStartTime };
