const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });


// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ahmadlotfygamersfield:"+process.env.DATABASE_PASSWORD+"cluster0.vljywdn.mongodb.net/?retryWrites=true&w=majority";

// const dbConnect = () => {
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true, 
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
// }



const dbConnect = () => {
  // Connect to the database
  const dbConnectionString = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
    console.log(dbConnectionString) 
  // REMOTE DATABASE 
  mongoose
    .connect(dbConnectionString, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    });
};


module.exports = dbConnect;