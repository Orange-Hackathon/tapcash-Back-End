const dotenv = require("dotenv");
const dbConnect = require("./db-connection/connection");
dotenv.config({ path: "./.env" });
// Subscribe to unhandled rejection of any promise

const app = require("./app");
//dbConnect();





// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ahmadlotfygamersfield:Bashera2@cluster0.vljywdn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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
