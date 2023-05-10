const fs = require("fs");
const User = require("../models/user-model");
const Notification = require("../models/notification-model");
const dbConnect = require("./../db-connection/connection");

dbConnect();

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));


const notifications = JSON.parse(
  fs.readFileSync(`${__dirname}/notifications.json`, "utf-8")
);


/**
 * Inserts all seeds in the collections
 */
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Notification.create(notifications, { validateBeforeSave: false });
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

/**
 * Deletes all collections' documents
 */
const deleteData = async () => {
  try {
    await User.deleteMany();
   
    await Notification.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
