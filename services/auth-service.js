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
  signToken = (phoneNumber) => {
    const res = jwt.sign(
      { phoneNumber: phoneNumber },
      "orangeHackathon",
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
          error: "Wrong username or PIN",
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
      const token = await this.signToken(body.phoneNumber);
      return {
        state: true,
        error: null,
        token: token, //token,
        expiresIn: 3600 * 24,
        phoneNumber: body.phoneNumber,
        type:user.type
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
        ,body.type,
        body.parentPhoneNumber
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
   * Save user in database
   * @param {String} email email of the user
   * @param {String} hash hashed PIN
   * @param {String} username username of the user
   * @param {String} type type of the email
   * @returns {object} (status,username)
   * @function
   */
  createUser = async (phoneNumber, firstName, lastName,email, PIN,type,parentPhoneNumber) => {
    const user = new User({
      phoneNumber: phoneNumber,
      firstName: firstName,
      lastName: lastName,
      email:email,
      PIN: PIN,
      _id:phoneNumber,
      type:type,
      sons:(type=="parent"?[]:null),
      parent:(type=="parent"?null:parentPhoneNumber)
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
        console.log(err);
        return {
          phoneNumber: null,
          status: "error",
          error: err,
        };
      });
    return result;
  };

 
  /**
   * Resets user PIN
   *  @param {string} username
   * @param {string} currentPIN
   * @param {string} newPIN
   * @param {string} confirmedNewPIN
   * @function
   */
  resetPIN = async (
    phoneNumber,
    currentPIN,
    newPIN,
    confirmedNewPIN
  ) => {
    const user = await this.getOne({ _id: phoneNumber });
    if (!user) throw new AppError("user is invalid or expired!", 400);
    if (confirmedNewPIN !== newPIN)
      throw new AppError("PIN is not equal to confirmed PIN!", 400);
    const result = await bcrypt.compareSync(currentPIN, user.PIN);
    if (!result) throw new AppError("this PIN is not correct!", 400);
    const hash = await bcrypt.hash(newPIN, 10);
    user.PIN = hash;
    await user.save();
  };
}

module.exports = AuthService;
