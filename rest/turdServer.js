var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');
app.use(cors());

// a simple ad to array text file for now
// TODO
const LOG_FILE = 'files/log.json';
const TURD_FILE='files/turds.json';
const QUESTIONS_FILE='files/questions.json';

// body parse thing
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));     // to support URL-encoded bodies


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "text/json; charset=utf-8");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept");
  next();
});

app.get('/questions', function (req, res) {
   const data = getObjFromJsonFile(QUESTIONS_FILE);
   res.end(JSON.stringify(data));
});
app.get('/turds', function (req, res) {
   const turds = getObjFromJsonFile(TURD_FILE);
   const date = new Date();
   console.log('date', date.toString());
   console.log('getturds', turds.length);
   res.end(JSON.stringify(turds));
});


app.post('/turd/save', function (req, res) {
  const turd = req.body ? req.body : [];
  const result = appendToJson(TURD_FILE, turd);
  console.log('/turd/save result', result);
  res.end(JSON.stringify(result));
});

function appendToJson(fileName, objArr) {
  let items = getObjFromJsonFile(fileName);
  items.push(objArr);
  const string = JSON.stringify(items, null, 2);
  fs.writeFileSync(fileName, string);
  return items;
}

function getObjFromJsonFile(fileName) {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

const server = app.listen(8095, function () {
  const host = server.address();
  const port = server.address().port;
  // 82.31.145.132
  console.log("TurdServer listening at http://localhost:" + port);
  console.log("TurdServer listening at http://127.0.0.1:" +  port);
})
