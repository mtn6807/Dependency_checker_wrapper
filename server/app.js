const express = require('express')
const app = express();
const port = 3000
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const DBNAME = "dependency_scans"


function insertDocuments(db, data,callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    data
  ]);
}

function addToDB(data){
  // Connection URL
  const url = 'mongodb://localhost:27017';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(DBNAME);
    
    insertDocuments(db,data,function(){
      client.close();
    })
  });
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).json({ok: true})
});

final = {}
dependenciesl = []
app.post('/newscan', (req, res) => {
    res.status(200).json({ok: true})
    req.body.data.forEach((x)=>{
        dependenciesl.push(x)
    })
    if(req.body.final==true){
        final["data"]=dependenciesl
        addToDB(final)
    }
});

app.get('/', (req,res) =>{
    res.send(final)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});