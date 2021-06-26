const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const MongoClient = require("mongodb").MongoClient;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rpvut.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
    console.log("connection error", err);
    const eventCollection = client.db("blogger").collection("events");
    const adminsCollection = client.db("blogger").collection("admins");
    // console.log("database connected successfully")


    // delete post 
    app.delete('/deleteBlog/:id', (req, res) => {
      eventCollection.deleteOne({ _id: ObjectId(req.params.id) })
          .then(result => {
              res.send(result.deletedCount > 0);
          })
  })

    // admin detail
    app.get('/adminDetails', (req, res) => {
      adminsCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          });
  });

    app.get("/event", (req, res) => {
      eventCollection.find().toArray((err, items) => {
        res.send(items);
        console.log("from data base", items);
      });
    });

    app.post("/addEvent", (req, res) => {
        const newEvent = req.body;
        console.log("adding new event:", newEvent);
        eventCollection.insertOne(newEvent).then((result) => {
          console.log("inserted count", result.insertedCount);
          res.send(result.insertedCount > 0);
        });
      });
    
      
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



