const Service = require("./service");
const AppError = require("./../utils/app-error");
const Email = require("./../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const AuthService = require("./../services/auth-service");
const Bill = require("../models/bill-model");
const HistoryTransaction =require("../models/history-transaction-model");
var authServiceInstance = new AuthService(User);

/**
 * Service class to handle User manipulations.
 * @class UserService
 */
class UserService extends Service {
  constructor(model) {
    super(model);
  }
  /**
   * Signing the token
   * @param {String} emailType email type.
   * @param {String} username username of the user.
   * @returns {String} (signed token)
   * @function
   */
  signToken = (emailType, username) => {
    return jwt.sign(
      { emailType: emailType, username: username },
      "mozaisSoHotButNabilisTheHottest",
      { expiresIn: "120h" }
    );
  };

  /**
   * Get info of a user
   * @param {String} phoneNumber user's phone number.
   * @returns {Object} (status)
   * @function
   */
  getInfo = async (phoneNumber) => {
    const user = await this.getOne({ phoneNumber: phoneNumber });
    if (!user) {
      return {

        status: false,
        error: "invalid phone number",
      };
    }
    return {
      status: true,

      user: {
        phoneNumber: user.phoneNumber,
        balance: user.balance,
        avatar: user.avatar,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
    };
  };



  /**
   * Retreive bills of a user
   * @param {String} phoneNumber user's phone number.
   * @returns {Object} (status)
   * @function
   */
  getBills = async (phoneNumber) => {
    const user = await this.getOne({ phoneNumber: phoneNumber });
    if (!user) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    return {
      status: true,
      bills: user.bills,
    };
  };

/**
   * Transfer money to a user
   * @param {String} senderphoneNumber sender phone number.
   * @param {String} receiverPhoneNumber receiver phone number.
   * @param {String} amount amount of money.
   * @returns {Object} (status)
   * @function
   */
  transferMoney = async (senderphoneNumber, receiverPhoneNumber, amount) => {
    console.log(senderphoneNumber, receiverPhoneNumber, amount);
    const sender = await this.getOne({ phoneNumber: senderphoneNumber });
    const receiver = await this.getOne({ phoneNumber: receiverPhoneNumber });
    if (!sender || !receiver) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    if (sender.balance < amount) {
      return {
        status: false,
        error: "insufficient balance",
      };
    }
    try {
      sender.balance -= amount;
      receiver.balance += amount;
      const transaction=new HistoryTransaction({
        fromID:sender._id,
        toID:receiver._id,
        amount:amount,
        type:"Transfer",
      });
      sender.transactions.push(transaction);
      receiver.transactions.push(transaction);

      await transaction.save();
      await sender.save();
      await receiver.save();
    } catch (err) {
      return {
        status: false,
        error: "error",
      };
    }
    return {
      status: true,
    };
  };
  /**
   * Pay a bill for a user
   * @param {String} billID bill id.
   * @param {String} phoneNumber phone number of the user.
   * @returns {Object} (status)
   * @function
   */
  payBill = async (phoneNumber,billID) => {
    const user = await this.getOne({ phoneNumber: phoneNumber });
    if (!user) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    const bill = user.bills.find((el) => el._id == billID);
    if (!bill) {
      return {
        status: false,
        error: "invalid bill id",
      };
    }
    if (bill.isPaid) {
      return {
        status: false,
        error: "bill is already paid",
      };
    }
    if (user.balance < bill.amount) {
      return {
        status: false,
        error: "insufficient balance",
      };
    }
    try {
      user.balance -= bill.amount;
      bill.isPaid = true;
      billDoc=Bill.getOne({_id:billID});
      billDoc.isPaid=true;

      await billDoc.save();
      await user.save();
    } catch (err) {
      return {
        status: false,
        error: "error",};
    }
    return {
      status: true,
    };
  };
  /**
   * Add restriced category to a child from parent
   * @param {String} phoneNumber phone number of the parent.
   * @param {String} childPhoneNumber phone number of the child.
   * @param {String} category restricted category.
   * @returns {Object} (status)
   * @function
   */
  addRestrictedCategory = async ( phoneNumber, childPhoneNumber, category) => {
    const parent = await this.getOne({ phoneNumber: phoneNumber });
    const child = await this.getOne({ phoneNumber: childPhoneNumber });
    if (!parent || !child) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    if (child.restrictedCategories.indexOf(category) != -1) {
      return {
        status: false,
        error: "category is already restricted",
      };
    }
    try {
      child.restrictedCategories.push(category);
      await child.save();
    } catch (err) {
      return {
        status: false,
        error: "error",
      };
    }
    return {
      status: true,
    };
  };


  
  /**
   * Remove restriced category from a child
   * @param {String} phoneNumber phone number of the parent.
   * @param {String} childPhoneNumber phone number of the child.
   * @param {String} category restricted category.
   * @returns {Object} (status)
   * @function
   */
  removeRestrictedCategory = async (phoneNumber, childPhoneNumber, category) => {
    const parent = await this.getOne({ phoneNumber: phoneNumber });
    const child = await this.getOne({ phoneNumber: childPhoneNumber });
    if (!parent || !child) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    if (child.restrictedCategories.indexOf(category) == -1) {
      return {
        status: false,

        error: "category is already not restricted",
      };
    }
    try {
      child.restrictedCategories.splice(
        child.restrictedCategories.indexOf(category),
        1
      );
      await child.save();
    } catch (err) {
      return {
        status: false,
        error: "error",
      };
    }
    return {
      status: true,
    };
  };
   /**
   * Add child to parent
   * @param {String} phoneNumber phone number of the parent.
   * @param {String} childPhoneNumber phone number of the child.
   * @returns {Object} (status)
   * @function
   */
  addSon = async (phoneNumber, childPhoneNumber) => {
    const parent = await this.getOne({ phoneNumber: phoneNumber });
    const child = await this.getOne({ phoneNumber: childPhoneNumber });
    if (!parent || !child) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    if (child.parent!=phoneNumber) {
      return {
        status: false,
        error: "this isn't the parent of this child",
      };
    }
    try {
      parent.sons.push(childPhoneNumber);
      await parent.save();
    } catch (err) {
      return {
        status: false,
        error: "error",

      };
    }
    return {
      status: true,
    };
  };
   /**
   * Get child info
   * @param {String} phoneNumber phone number of the parent.
   * @param {String} childPhoneNumber phone number of the child.
   * @returns {Object} (status)
   * @function
   */
  getChildInfo = async (phoneNumber, childPhoneNumber) => {
    const parent = await this.getOne({ phoneNumber: phoneNumber });
    const child = await this.getOne({ phoneNumber: childPhoneNumber });
    if (!parent || !child) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    if (child.parent!=phoneNumber) {
      return {
        status: false,

        error: "this isn't the parent of this child",

      };
    }
    return {
      status: true,
      info: {
        phoneNumber: child.phoneNumber,
        totalSpent: child.totalSpent,
        allowance: child.allowance,
        balance: child.balance,
        avatar: child.avatar,
        email: child.email,
        firstName: child.firstName,
        lastName: child.lastName,
        restrictedCategories: child.restrictedCategories,
      },
    };
  };

  /**
   * Get transactions of a user
   * @param {String} phoneNumber user's phone number.
   * @returns {Object} (status)
   * @function
   */
  getTransactions = async (phoneNumber) => {
    const user = await this.getOne({ phoneNumber: phoneNumber });
    if (!user) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    return {
      status: true,
      transactions: user.transactions,
    };
  };
  /**
   * Update email of a user
   * @param {String} email user's email.
   * @returns {Object} (status)
   * @function
   */
  updateEmail = async (phoneNumber,email ) => {
    const user = await this.getOne({ phoneNumber: phoneNumber });
    if (!user) {
      return {
        status: false,
        error: "invalid phone number",
      };
    }
    try {
      user.email = email;
      await user.save();
    } catch (err) {
      return {
        status: false,
        error: "error",
      };
    }
    return {
      status: true,
    };
  };



  /**
   * Saving notification in user's document
   * @param {String} id notification id.
   * @param {String} username username of the user.
   * @returns {Object} (status)
   * @function
   */
  saveNOtificationOfUser = async (id, username) => {
    const user = await this.getOne({ _id: username });
    const newNotification = {
      notificationID: id,
      isRead: false,
      isDeleted: false,
    };
    try {
      user.notifications.push(newNotification);
      user.save();
    } catch (err) {
      return {
        status: false,
        error: err,
      };
    }

    return {
      status: true,
    };
  };
  /**
   * Saves filename to database
   * @param {object} data
   * @param {string} phoneNumber
   * @param {object} file
   * @returns {string} avatar Name of the file
   * @function
   */
  uploadUserPhoto = async (action, phoneNumber, file) => {
    if (!action)
      throw new AppError("No attachment or action is provided!", 400);
    var avatar = "default.jpg";
    if (action === "upload") {
      if (!file) throw new AppError("No photo is uploaded!", 400);
      avatar = file.filename;
    }
    await this.findByIdAndUpdate(phoneNumber, { avatar }, { runValidators: true });
    return avatar;
  };

  /**
   * Sends reset link to specified user by email
   * @param {string} phoneNumber
   * @function
   */
  forgotPIN = async (phoneNumber) => {
    const user = await this.getOne({ _id: phoneNumber });
    if (!user) {
      throw new AppError("There is no user with this phone number!", 404);
    }
    // Generate the random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // in order to save the passwordResetToken and passwordResetExpires
    // Send the reset token to the user email
    try {
      const reqURL = `https://backend-veoy.onrender.com/user/reset-password/${resetToken}`;
      await new Email(user, reqURL).sendPasswordReset();
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError("There was an error in sending the mail!", 500);
    }
  };


}
module.exports = UserService;
