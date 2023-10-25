require("dotenv").config();
const {
  FetchTransactionDetail,
  stopListening,
} = require("../repository/index");

exports.getTransaction = async (req, res) => {
  let account = req.params.account;
  let startTime = req.body.startTime;
  if (account === process.env.receiver_account) {
    FetchTransactionDetail(account, startTime);
    res.send({ status: "listening to block..." });
  } else {
    res.send({ status: "Invalid Address" });
  }
};

exports.stopListening = async (req, res) => {
  let chainId = req.params.chainid;
  stopListening(chainId);
  res.send("Stoped listening...");
};
