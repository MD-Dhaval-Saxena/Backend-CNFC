const { Schema, model } = require("mongoose");

const ConfirmSchema = new Schema({
  account: {
    type: String,
    required: true,
  },
  tokenAmount: {
    type: Number,
    default: 0,
  },
  lastUpdate: {
    type: Number,
    default: () => Date.now(),
  },
  isBalanceUpdated: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("confirm-trx", ConfirmSchema);
