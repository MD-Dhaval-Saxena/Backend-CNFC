const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
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
  isTokenClaimed: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("user", UserSchema);
