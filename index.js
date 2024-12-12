const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;


// middleWare 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.sgplmdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    // Collection List
    const lessonData = client.db('NihonLearnDB').collection('lessonsCollection');

    app.get("/lessons", async(req,res) => {
        const lessons = await lessonData.find().toArray();
        res.send(lessons);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Nihon Learn Server is running');
  })
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })