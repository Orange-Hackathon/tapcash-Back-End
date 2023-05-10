const mongoose = require("mongoose");
const validator = require("validator");

const crypto = require("crypto");
//const { default: isEmail } = require("validator/lib/isemail");





const userSchema = new mongoose.Schema({
  /*********************************************************************************
   * the attributes
   **********************************************************************************/
  _id: {
    type: String,
    minLength: [5, "the minimum length is 5 characters"],
    maxLength: [20, "the maximum length is 20"],
  },
  firstName: {
    type: String,
    required: [true, "Please provide your first name"],
    minLength: [3, "the minimum length is 3 characters"],
    maxLength: [20, "the maximum length is 20"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"],
    minLength: [3, "the minimum length is 3 characters"],
    maxLength: [20, "the maximum length is 20"],
  },
  bills:[
    {
      type: mongoose.Schema.ObjectId,
      ref: "Bill",
    },
  ],
  type:{
    type:String,
  },
  restrictedCategories: [
    {
      type: String,
    },
  ],
  totalSpent:{
    type:Number,
  },
  allowance:{
    type:Number,
  },

  sons:[
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  parent:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },




  
  avatar: {
    type: String,
    default: "default.jpg",
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  balance:{
    type:Number,
    default:0
  },
  phoneNumber: {
    type: String,
    unique: true,
    validate: [validator.isMobilePhone, "please provide a valid phone number"],
  },
  createdAt: {
    type: Date,
    required: [true, "missing the date of creation of the user"],
    default: Date.now(),
  },
  
  PIN: {
    type: Number,
  },
 

  
  transactions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Transaction",
    },
  ],


  
  /***************************************
   * notifications relations
   ***************************************/
  notifications: [
    {
      type: notificationSchema,
    },
  ],
  
});

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes with millis
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
