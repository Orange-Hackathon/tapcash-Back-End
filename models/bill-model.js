const mongoose = require("mongoose");


const billSchema = mongoose.Schema({
    billName: String,
    billAmount: Number,
    billDate: Date,
    billType: String,
    billStatus: String,
    billDescription: String,
    billUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },   
});           
const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
