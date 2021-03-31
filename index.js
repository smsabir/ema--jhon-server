const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctdrv.mongodb.net/emaJhon?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhon").collection("products");
    const ordersCollection = client.db("emaJhon").collection("orders");
    // perform actions on the collection object

    app.post('/addProduct', (req, res) => {
        const allProduct = req.body;
        //   console.log(allProduct)
        productsCollection.insertOne(allProduct)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((error, documents) => {
                res.send(documents);
            })
    })

    app.get('/products/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((error, documents) => {
                res.send(documents[0]);
            })

       
    })
    app.post('/productsByKeys', (req, res) =>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((error, documents)=>{
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

});

app.listen(process.env.PORT || port)