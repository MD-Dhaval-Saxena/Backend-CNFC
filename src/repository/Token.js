require("dotenv").config();
const ethers = require("ethers");
const { tokenAbi, usdtAbi, contractAbi } = require("../helpers/index");
const contract_address = process.env.Contract_address;
const Token_address = process.env.Token_address;
const usdt_address = process.env.usdt_address;

const privateKey = process.env.privateKey;
const provider = new ethers.providers.JsonRpcProvider(
  process.env.sepolia_network
);

// Utilites functions
const toEth = (value) => ethers.utils.formatEther(value);
const toWei = (value) => ethers.utils.parseEther(value.toString());

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contract_address, contractAbi, provider);
const token = new ethers.Contract(Token_address, tokenAbi, provider);
const usdt_token = new ethers.Contract(usdt_address, usdtAbi, provider);
contracWithWallet = contract.connect(wallet);
tokenWithWallet = token.connect(wallet);
usdtWithWallet = usdt_token.connect(wallet);

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

const send_usdt = async (_to, _amount) => {
  let amount = _amount * 10 ** 6;
  const tx = await usdtWithWallet.transfer(_to, amount);
  console.log("Usdt Token Sent");
};
const calculateToken = async (_tokenSent, _account) => {
  if (_tokenSent === 0) {
    let data = { msg: "No token to sent" };
    return data;
  }
  let usdt = _tokenSent;
  const tx = await contracWithWallet.updateBalance(usdt, _account);

  let event = await tx.wait();
  let data = event.events[0].args;

  let dataDecode = {
    account: data[0],
    sentUsdt: parseInt(data[1]),
    updatedBalance: parseInt(data[2]),
    timestamp: toDate(data[3]),
  };
  console.log("🚀 --------------------------------------------🚀");
  console.log("🚀 ~ calculateToken ~ dataDecode:", dataDecode);
  console.log("🚀 --------------------------------------------🚀");
  return dataDecode;
};
getStartTime = async () => {
  let startime = await contracWithWallet.startTime();
  let decodeData = parseInt(startime);
  return decodeData;
};
module.exports = { calculateToken, send_usdt, getStartTime };
