const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const fs = require('fs');
const port = 3000;
const bodyParser = require('body-parser');

function writetoDB(newjson){
  fs.writeFile(dbFile, JSON.stringify(newjson), function writeJSON(err) {
      if (err) return console.log(err);
  });
}

function newScan(filename, html){
  fs.writeFile(filename,html,(err)=>{
    if(err){console.log(err)}
  })
}

var dbFile= "DB.json";
var db
try{
    readFile = fs.readFileSync(dbFile);
    db = JSON.parse(readFile)
}catch(err){
    console.log("couldn't open db.")
    db = {};
}
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.get('/health', (req, res) => {
  res.status(200).json({ok: true})
});

final = {}
dependenciesl = []
app.post('/newscan', (req, res) => {
    res.status(200).json({ok: true})
    filename = "./scans/"+req.body.name+req.body.date+".html".replace(' ','-');
    newScan(filename,req.body.data);
    db[req.body.name] = {"date": req.body.date, "html": filename};
    writetoDB(db);
});

app.use(express.static('public'));
app.use('/scans', express.static('public/scans'), serveIndex('public/scans', { 'icons': true }))
app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});