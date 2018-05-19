var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');
app.use(cors());

// a simple ad to array text file for now
// TODO
const TURD_LOG = 'turdLog.json';
const TURD_DATA='turdData.json';
const TURD_EDIT_OPTIONS='appEditTurdOptions.json';

// The form options is a MUST
if (!fs.existsSync(TURD_EDIT_OPTIONS)) {
  // this is very bad, lets logit
  //this.logit('open TURD_EDIT_OPTIONS failed', TURD_EDIT_OPTIONS);
  console.log('ERROR' + TURD_EDIT_OPTIONS + ' did not exist Severity=10' );

};


// TODO add this functionlaity to grunt install or somewhere
if (!fs.existsSync(TURD_LOG)) {fs.writeFileSync(TURD_LOG, '[]')};
if (!fs.existsSync(TURD_DATA)) {fs.writeFileSync(TURD_DATA, '[]')};

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
   const data = getObjFromJsonFile(TURD_EDIT_OPTIONS);
   res.end(JSON.stringify(data));
});
app.get('/turds', function (req, res) {
   const turds = getObjFromJsonFile(TURD_DATA);
   const date = new Date();
   console.log('date', date.toString());
   console.log('getturds', turds.length);
   res.end(JSON.stringify(turds));
});


app.post('/turd/save', function (req, res) {
  const turd = req.body ? req.body : [];
  const result = appendToJson(TURD_DATA, turd);
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

logit = (msg, severity) => {
  console.log('logit called', msg , severity);
}

const server = app.listen(8095, function () {
  const host = server.address();
  const port = server.address().port;
  // 82.31.145.132
  console.log("TurdServer listening at http://localhost:" + port);
  console.log("TurdServer listening at http://127.0.0.1:" +  port);
})
