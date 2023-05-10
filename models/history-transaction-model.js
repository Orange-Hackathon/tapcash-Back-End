const mongoose = require("mongoose");

const historyTransactionSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  fromID: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",

  },
  toID: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  amount:{
    type: Number,
    default: 0,
  },
  type:{
    type: String,
    default: "Transfer",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  
});

const HistoryTransaction = mongoose.model("HistoryTransaction", historyTransactionSchema);

module.exports = HistoryTransaction;
