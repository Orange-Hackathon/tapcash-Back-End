const catchAsync = require("../utils/catch-async");
const User = require("./../models/user-model");
const UserService = require("./../services/user-service");

const userServiceInstance = new UserService(User);

/**
 * Transfer money to a user 
 * @param {function} (req, res)
 * @returns {object} res
 */
const transferMoney=async(req,res)=>{
  if(!req.body.receiverPhoneNumber||!req.body.amount){
    return res.status(500).json({
      response: "error providing receiver Phone Number or amount",
    });
  }
  const result = await userServiceInstance.transferMoney(req.phoneNumber,req.body.receiverPhoneNumber,req.body.amount);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
  });
}
/**
 * Retrive bills of a user 
 * @param {function} (req, res)
 * @returns {object} res
 */
const getBills=async(req,res)=>{
  if(!req.phoneNumber){
    return res.status(500).json({
      response: "error providing phone number",
    });
  }
  const result = await userServiceInstance.getBills(req.phoneNumber);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
    bills:result.bills
  });

}
/**
 * Get info of a user  
 * @param {function} (req, res)
 * @returns {object} res
 */
const getInfo=async(req,res)=>{
  if(!req.phoneNumber){
    return res.status(500).json({
      response: "error providing phone number",
    });
  }
  const result = await userServiceInstance.getInfo(req.phoneNumber);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
    info:result.info
  });

}

/**
 * Pay a bill of a user
 * @param {function} (req, res)
 * @returns {object} res
 */
const payBill=async(req,res)=>{
  if(!req.body.billID){
    return res.status(500).json({
      response: "error providing bill ID",
    });
  }
  const result = await userServiceInstance.payBill(req.phoneNumber,req.body.billID);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
  });

}
/**
 * Add restricted category to a user
 * @param {function} (req, res)
 * @returns {object} res
 */
const addRestrictedCategory=async(req,res)=>{
  if(!req.body.category){
    return res.status(500).json({
      response: "error providing category",
    });
  }
  const result = await userServiceInstance.addRestrictedCategory(req.phoneNumber,req.body.childPhoneNumber,req.body.category);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
  });
  
}
/**
 * Remove restricted category to a child by parent
 * @param {function} (req, res)
 * @returns {object} res
 */
const removeRestrictedCategory=async(req,res)=>{
  if(!req.body.category){
    return res.status(500).json({
      response: "error providing category",
    });
  }
  const result = await userServiceInstance.removeRestrictedCategory(req.phoneNumber,req.body.childPhoneNumber,req.body.category);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
  });

}



/**
 * Add a son to a user
 * @param {function} (req, res)
 * @returns {object} res
 */
const addSon=async(req,res)=>{
  if(!req.body.childPhoneNumber){
    return res.status(500).json({
      response: "error providing child phone number",
    });
  }
  const result = await userServiceInstance.addSon(req.phoneNumber,req.body.childPhoneNumber);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
  });

}
/**
 * Get child info
 * @param {function} (req, res)
 * @returns {object} res
 */
const getChildInfo=async(req,res)=>{
  if(!req.body.childPhoneNumber){
    return res.status(500).json({
      response: "error providing child phone number",
    });
  }
  const result = await userServiceInstance.getChildInfo(req.phoneNumber,req.body.childPhoneNumber);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
    info:result.info
  });

}

/**
 * Get transactions of a user
 * @param {function} (req, res)
 * @returns {object} res
 */
const getTransactions=async(req,res)=>{
  if(!req.phoneNumber){
    return res.status(500).json({
      response: "error providing phone number",
    });
  }

  const result = await userServiceInstance.getTransactions(req.phoneNumber);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }
  return res.status(200).json({
    response: "done",
    transactions:result.transactions
  });

}
/**
 * Update email of a user
 * @param {function} (req, res)
 * @returns {object} res
 */
const updateEmail=async(req,res)=>{
  if(!req.body.email){
    return res.status(500).json({
      response: "error providing email",
    });
  }
  const result = await userServiceInstance.updateEmail(req.phoneNumber,req.body.email);
  if (!result.status) {
    return res.status(500).json({
      status: "operation failed",
    });
  }

  return res.status(200).json({
    response: "done",
  });
  
}







/**
 * Saves filename to database
 * @param {function} (req, res, next)
 * @returns {object} res
 */
const uploadUserPhoto = catchAsync(async (req, res, next) => {
  var avatar = undefined;
  try {
    avatar = await userServiceInstance.uploadUserPhoto(
      req.body.action,
      req.phoneNumber,
      req.file
    );
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    avatar,
  });
});

module.exports = {
  uploadUserPhoto,
  updateEmail,
  transferMoney,
  getBills,
  getInfo,
  payBill,
  addRestrictedCategory,
  removeRestrictedCategory,
  addSon,
  getChildInfo,
  getTransactions
};
