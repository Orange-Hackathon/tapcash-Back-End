var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount = require("../config/push-notification-key.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

/**
 * Service class to send notifications.
 * @class PushNotificationsService
 */
class PushNotificationsService {
  constructor() {}
  /**
   * Send message using firebase
   * @param {Object} message message content.
   * @returns {Object} {status: boolean,message:string}.
   * @function
   */
  sendNotification = async (message) => {
    FCM.send(message, function (err) {
      if (err) {
        return {
          status: false,
          message: err,
        };
      } else {
        return {
          status: true,
          message: "notification sent",
        };
      }
    });
    return {
      status: true,
      message: "notification sent",
    };
  };
  /**
   * Send new offer notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} paymentID payment id.
   * @returns {Boolean} status.
   * @function
   */
  newOfferNotification = async (receiverFcmToken,offer) => {
    try {
      let message = {
        notification: {
          title: "You have a new offer",
          body: `${offer}`,
        },
        
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * Send done payment notification using firebase
   * @param {String} receiverFcmToken notification receiver firebase token.
   * @param {String} paymentID upvoted username.
   * @returns {Boolean} status.
   * @function
   */
  upvotePostNotification = async (
    receiverFcmToken,
   paymentID
  ) => {
    try {
      let message = {
        notification: {
          title: "Done Payment",
          body: `Your payment with id ${paymentID} is done`,
        },
        data: {
          paymentID: `${paymentID}`,
          type: "2",
        },
        token: receiverFcmToken,
      };
      const result = await this.sendNotification(message);
      if (result.status) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
 
}
module.exports = PushNotificationsService;
