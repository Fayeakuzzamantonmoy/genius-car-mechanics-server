const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config(); 
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iut4d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        app.get('/services', async(req,res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/services', async(req,res)=> {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
    }
    finally{
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req,res)=> {
    res.send('Running Genius Server');
});

app.get('/hello', (req,res) => {
    res.send('hello update here')
})

app.listen(port, ()=> {
    console.log('Running Genius Server on port', port);
})