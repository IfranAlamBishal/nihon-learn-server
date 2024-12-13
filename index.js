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
        const userCollection = client.db('NihonLearnDB').collection('userCollection');

        // Get Oparetions
        app.get("/lessons", async (req, res) => {
            const lessons = await lessonData.find().toArray();
            res.send(lessons);
        });

        app.get("/users", async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user.role === 'admin';
            }
            res.send({ admin });
        });


        // Post Operations
        app.post("/register_user", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // Put Oparetions
        app.put("/update_role", async (req, res) => {
            const { userId, newRole } = req.body;

            if (userId && newRole) {
                const id = { _id: new ObjectId(userId) };
                const updatedRole = {
                    $set: { role: newRole },
                };

                const result = await userCollection.updateOne(id, updatedRole);
                res.send(result);
            }
        });


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