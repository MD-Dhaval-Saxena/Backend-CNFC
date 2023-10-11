require("dotenv").config();
const {
  FetchTransactionDetail,
  stopListening,
  pendingTrx,
} = require("../repository/index");
const { getStartTime, calculateToken } = require("../repository/Token.js");

exports.getTransaction = async (req, res) => {
  let account = req.params.account;
  let startTime = req.body.startTime;
  if (account === process.env.receiver_account) {
    FetchTransactionDetail(account, startTime);
    res.send({ status: "listening to block..." });
  }
  else{
    res.send({status:"Invalid Address"})
  }
};

exports.getStartTime = async (req, res) => {
  let startTime = await getStartTime();
  res.send({ startTime });
};

exports.viewTrx = async (req, res) => {
  let trx = await pendingTrx();
  res.send(trx);
};

exports.stopListening = async (req, res) => {
  let chainId = req.params.chainid;
  stopListening(chainId);
  res.send("Stoped listening...");
};
