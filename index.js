const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');

const app = express()

const cors = require('cors');

require('dotenv').config()

//midleware 

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {

    res.send("Admission hub is running !!!")
})



const uri = `mongodb+srv://${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}@cluster0.yaanftr.mongodb.net/?retryWrites=true&w=majority`;

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

        const admissionDBCollection = client.db("admissionDB").collection("colleges")


        app.get("/colleges", async (req, res) => {
            const colleges = admissionDBCollection.find()

            const result = await colleges.toArray()
            res.send(result)
        })

        //college details

        app.get("/colleges/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await admissionDBCollection.findOne(query)
            res.send(result);
        })
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Admission Hub is  running at port ${port}`);
})

