const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

const port = process.env.PORT || 5000;


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkkoe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})




client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  console.log("database conceted");
  app.post('/addProduct', (req, res) => {
      const products = req.body;
      productCollection.insertOne(products)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req,res) =>{
      productCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.delete('/delete/:id',(req, res) => {
    console.log(req.params.id);
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      console.log(result)
    })
  })
});


app.listen(port);