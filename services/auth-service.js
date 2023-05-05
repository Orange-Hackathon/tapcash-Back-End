const Service = require("./service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const decodeJwt = require("../controllers/google-facebook-oAuth");
const randomUsername = require("../utils/random-username");
const User = require("../models/user-model");
const AppError = require("../utils/app-error");

/**
 * Service class to handle Authentication manipulations.
 * @class AuthService
 */
class AuthService extends Service {
  constructor(model) {
    super(model);
  }
  /**
   * Check whether user name is in database or not (function)
   * @param {Object} username username of the user.
   * @returns {String} state of the operation whether false or true to indicate the sucess.
   * @returns {Object} user return from the database.
   * @function
   */
  availableUser = async (username) => {
    const user = await this.getOne({ _id: username });
    if (user) {
      return {
        state: false,
        user: user,
      };
    } else {
      return {
        state: true,
        user: null,
      };
    }
  };

/**
   * Check whether user name is in database or not (function)
   * @param {Object} phoneNumber phone number  of the user.
   * @returns {String} state of the operation whether false or true to indicate the sucess.
   * @returns {Object} user return from the database.
   * @function
   */
availablePhoneNumber = async (phoneNumber) => {
  const user = await this.getOne({ phoneNumber: phoneNumber });
  if (user) {
    return {
      state: false,
      user: user,
    };
  } else {
    return {
      state: true,
      user: null,
    };
  }
};


  /**
   * Signing the token
   * @param {String} emailType email type.
   * @param {String} username username of the user.
   * @returns {String} (signed token)
   * @function
   */
  signToken = (emailType, username) => {
    const res = jwt.sign(
      { emailType: emailType, username: username },
      "mozaisSoHotButNabilisTheHottest",
      { expiresIn: "120h" }
    );

    return res;
  };

  /**
   * Login
   * @param {Object} (body)
   * @returns {object} {token,expiresIn,username,state,error} or {state , error}
   * @function
   */
  login = async (body) => {

    const user = await this.getOne({ phoneNumber: body.phoneNumber });
      if (!user) {
        return {
          state: false,
          error: "Wrong username or password",
        };
      }
      const compareResult = await bcrypt.compareSync(
        body.PIN,
        user.PIN
      );
      if (!compareResult) {
        return {
          state: false,
          error: "Wrong PIN",
        };
      }
      const token = await this.signToken(body.type, body.username);
      return {
        state: true,
        error: null,
        token: token, //token,
        expiresIn: 3600 * 24,
        phoneNumber: body.phoneNumber,
      };
    }


  


  /**
   * Signup
   * @param {Object} (body)
   * @returns {object} {token,expiresIn,username,state,error} or {state , error}
   * @function
   */

  signup = async (body) => {
    const hash = await bcrypt.hash(body.PIN, 10);

         const result = await this.createUser(
        body.phoneNumber,
        body.firstName,
        body.lastName,
        body.email,
        hash
      );
      if (result.phoneNumber != null) {
         return {
          state: true,
          error: null,
          phoneNumber: result.phoneNumber,
        };
      } else {
        return {
          state: false,
          error: "ERROR!",
        };
      }
  }
  
  /**
   * Check whether email is in database or not (function)
   * @param {String} email  state of the operation whether false or true to indicate the sucess.
   * @returns {Boolean} exist whether the email exists or not.
   * @function
   */
  availableEmail = async (email) => {
    const user = await this.getOne({ email: email });
    if (user) {
      return {
        exist: true,
      };
    } else {
      return {
        exist: false,
      };
    }
  };
  /**
   * Save user in database
   * @param {String} email email of the user
   * @param {String} hash hashed password
   * @param {String} username username of the user
   * @param {String} type type of the email
   * @returns {object} (status,username)
   * @function
   */
  createUser = async (phoneNumber, firstName, lastName,email, PIN) => {
    const user = new User({
      phoneNumber: phoneNumber,
      firstName: firstName,
      lastName: lastName,
      email:email,
      PIN: PIN,
       });
    const result = user
      .save()
      .then(() => {
        return {
          phoneNumber: user.phoneNumber,
          status: "done",
        };
      })
      .catch((err) => {
        return {
          phoneNumber: null,
          status: "error",
          error: err,
        };
      });
    return result;
  };
  /**
   * Check whether google account or facebook account is in database or not (function)
   * @param {String} email the email that will be searched by in the database.
   * @param {String} type the type of the email that will be searched by in the database.
   * @returns {Object} user the returned user from the database.
   * @returns {Boolean} exist whether the email exists or not.
   * @function
   */
  availabeGmailOrFacebook = async (email, type) => {
    const user = await this.getOne({ email: email, type: type });
    if (user) {
      return {
        exist: true,
        user: user,
      };
    } else {
      return {
        exist: false,
        user: null,
      };
    }
  };
  /**
   * Change password according to type of email
   * @param {param} type type of the email.
   * @param {param} password password of the email.
   * @returns {String} (type whether '1' or the password parameter).
   * @function
   */
  changePasswordAccType = (type, password) => {
    return type == "facebook" || type == "gmail" ? "1" : password;
  };
  /**
   * Resets user password
   *  @param {string} username
   * @param {string} currentPassword
   * @param {string} newPassword
   * @param {string} confirmedNewPassword
   * @function
   */
  resetPassword = async (
    username,
    currentPassword,
    newPassword,
    confirmedNewPassword
  ) => {
    const user = await this.getOne({ _id: username });
    if (!user) throw new AppError("user is invalid or expired!", 400);
    if (confirmedNewPassword !== newPassword)
      throw new AppError("Password is not equal to confirmed password!", 400);
    const result = await bcrypt.compareSync(currentPassword, user.password);
    if (!result) throw new AppError("this password is not correct!", 400);
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
  };
}

module.exports = AuthService;
