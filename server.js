const dotenv = require("dotenv");
const dbConnect = require("./db-connection/connection");
dotenv.config({ path: "./.env" });
// Subscribe to unhandled rejection of any promise

const app = require("./app");
dbConnect();






// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb+srv://ahmadlotfygamersfield:Bashera2@cluster0.vljywdn.mongodb.net/?retryWrites=true&w=majority";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

// START SERVER
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(`${err.name}. ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log(`${err.name}. ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED, Shutting down...");
  server.close(() => console.log("Process terminated!"));
});
