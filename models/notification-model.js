const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  Icon: String,
  title: String,
  type: {
    type: String,
    enum: [
      "newBill",
      "donePayment",
     "offer",

    ],
  },
  text: String,
  sourceThing: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
