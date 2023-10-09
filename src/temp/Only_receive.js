const ethers = require("ethers");
const { erc20Abi } = require("../helpers");
require("dotenv").config();

const erc20TransferSignature = "0xa9059cbb";
const provider = new ethers.providers.JsonRpcProvider(
  process.env.sepolia_network
);

const _fetchTransactionDetail = async (recipientAddress) => {
  let blockNumber = await provider.getBlockNumber();
  const erc20Transfers = [];

  try {
    const block = await provider.getBlockWithTransactions(blockNumber);

    if (block && block.transactions) {
      for (const tx of block.transactions) {
        const toAddress = "0x" + tx.data.slice(34, 74);
        const tokenAmountHex = "0x" + tx.data.slice(74);
        const tokenAmount = parseInt(tokenAmountHex, 16);
        const tokenAddress = tx.to !== null ? tx.to : "";
        if (
          toAddress.toLowerCase() === recipientAddress.toLowerCase() &&
          tx.data.startsWith(erc20TransferSignature)
        ) {
          const contract = new ethers.Contract(
            tokenAddress,
            erc20Abi,
            provider
          );
          const tokenName = await contract.name();
          erc20Transfers.push({ ...tx, tokenName, tokenAmount, toAddress });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching ERC-20 transfers:", error);
  }
  return erc20Transfers;
};

const FetchTransactionDetail = async (recipientAddress) => {
  provider.on("block", async (blockNumber) => {
    console.log(blockNumber);
    const result = await _fetchTransactionDetail(recipientAddress);
    if (result.length > 0) {
      console.log(result);
    } else {
      console.log(
        `No ERC-20 transfers found for ${recipientAddress} in Block ${blockNumber}.`
      );
    }
  });
};

// FetchTransactionDetail("0x0fadb24c9a7ac088c329c4fa87730d3b2df2f525");

module.exports = { FetchTransactionDetail };
