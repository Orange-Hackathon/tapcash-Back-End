const mongoose = require("mongoose");


const billSchema = mongoose.Schema({
    _id: {
        type: String,
      },
    billName: String,
    billAmount: Number,
    billDate: Date,
    billType: String,
    isPaid: {
        type: Boolean,
        default: false,

    },
    billDescription: String,
    billUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },   
});           
const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
