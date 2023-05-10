const User = require("../models/user-model");

const AuthService = require("./../services/auth-service");

var authServiceInstance = new AuthService(User);

const catchAsync = require("../utils/catch-async");
const UserService = require("./../services/user-service");

const userServiceInstance = new UserService(User);

/**
 * Check whether phoneNumber is in database or not (route)
 * @param {Object} req request that contains the username.
 * @param {Object} res
 * @returns {object} response whether available or not.
 */
const availablePhoneNumber = async (req, res) => {
  const data = await authServiceInstance.availablePhoneNumber(req.query.phoneNumber);
  if (data.state) {
    return res.status(200).json({ response: "Available" });
  } else {
    return res.status(404).json({ response: "Not Available" });
  }
};


/**
 * Signup (route)
 * @param {Object} (req, res)
 * @returns {object} {token,expiresIn,username} or {error}
 */
const signup = async (req, res) => {
  const result = await authServiceInstance.signup(req.body);
  if (result.state) {
    return res.status(200).json({
      token: result.token, //token,
      expiresIn: result.expiresIn,
      phoneNumber: result.phoneNumber,
    });
  } else {
    return res.status(404).json({
      error: result.error,
    });
  }
};
/**
 * Login (route)
 * @param {Object} req req must contain the correct data.
 * @param {Object} res
 * @returns {object} {token,expiresIn,username} or {error}
 */

const login = async (req, res) => {
  const result = await authServiceInstance.login(req.body);
  if (result.state) {
    return res.status(200).json({
      token: result.token, //token,
      expiresIn: result.expiresIn,
      phoneNumber: result.phoneNumber,
      type: result.type,
    });
  } else {
    return res.status(404).json({
      error: result.error,
    });
  }
};

/**
 * Forgot PIN (route)
 * @param {Object} req req must contain the correct data.
 * @param {Object} res
 * @returns {object} {token,expiresIn,username} or {error}
 */
const forgotPIN = catchAsync(async (req, res, next) => {
  
  try {
    await userServiceInstance.forgotPIN(req.body.phoneNumber);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({
    status: "success",
    message: "Link is sent to the email!",
  });
});

/**
 * Reset PIN (route)
 * @param {Object} req req must contain the correct data.
 * @param {Object} res
 * @returns {object} {token,expiresIn,username} or {error}
 */
const resetUserPIN = catchAsync(async (req, res, next) => {
  try {
    await authServiceInstance.resetPIN(
      req.username,
      req.body.currentPIN,
      req.body.newPIN,
      req.body.confirmNewPIN
    );
  } catch (err) {
    return next(err);
  }
  return res.status(200).json({
    status: "success",
    message: "PIN is reset",
  });
});

module.exports = {
  
  signup,
  login,
  forgotPIN,
  resetUserPIN,
  availablePhoneNumber
};
