const { Schema, model } = require("mongoose");

const PendingSchema = new Schema({
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
    default: false,
  },
});

module.exports = model("pending-trx", PendingSchema);
