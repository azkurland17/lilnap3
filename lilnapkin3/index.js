const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
var useragent = require('useragent');
var url = require('url');
useragent(true);
const app = express()
var cookieParser = require('cookie-parser')
var cookieSecret = "lilnapkin";
app.use(cookieParser(cookieSecret))


app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/favicon', express.static('favicon'));
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


const xml = require('xml')
const date = new Date();
const timestamp = date.toLocaleString('en-GB', {
  timeZone: 'UTC'
});


var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'logs',
  user: 'root',
  password: 'rootroot',
});


connection.connect(function(err) {
  console.log('Connected as id ' + connection.threadId);
});

//creates a new client id (random number) that lasts for 15 min
app.get('/', function(req, res) {
  setNav(req);
  cookieCreate(req, res).then(test => {
    res.render('index');
  });
});

app.get('/home', function(req, res) {
  setNav(req);
  cookieCreate(req, res).then(cookie => {
    res.render('index');
  });
});

app.get('/donate', function(req, res) {
  setNav(req);
  cookieCreate(req, res).then(cookie => {
    res.render('donate');
  });
});

app.get('/learn', function(req, res) {
  setNav(req);
  cookieCreate(req, res).then(test => {
    res.render('learn');
  });
});

app.post('/event', function(req, res) {
  createEvent(req, res);
});

// app.post('/', function(req, res) {
//   cookieCreate(req.cookies, res).then();
//   console.log('cookie created successfully');
//
// });

//creates a cookie and sets it in the users browser
//inserts the cookie into the db if newly created
function cookieCreate(req, res) {
  return new Promise((resolve, reject) => {
    // new user
    if (req.cookies.visitor == undefined) {
      // make new cookie number
      console.log("creating new user");
      let cookieID = Math.floor(Math.random() * 100000000);
      let create_date = (new Date()).toString();
      connection.query(`Insert into visitors(cookie, create_date) values ('${cookieID}', '${create_date}');`, function() {
        setEnv(req, cookieID);
      });
      res.cookie('visitor', cookieID, {
        maxAge: 900000,
        httpOnly: true
      }); //only lasts for 15 min?
      resolve({
        cookie: cookieID
      });
    }
    resolve({
      user: "exists"
    });
  });
}

function setEnv(req, cookie) {
  var browser = useragent.parse(req.headers['user-agent']);
  browser = browser.toAgent(); // 'Chrome 15.0.874

  var osVar = useragent.parse(req.headers['user-agent']);
  osVar = osVar.os.toString(); // 'Mac OSX 10.8.1'

  console.log(browser, osVar);

  connection.query(`Insert into environment(os, browser, cookie) values ('${osVar}', '${browser}', '${cookie}');`);
}

function setNav(req) {
  let originURL = req.headers.referer;
  let pt_A = "/outside";
  if (originURL) {
    pt_A = (url.parse(req.headers.referer, true)).pathname;
  }
  let pt_B = req.url;
  connection.query(`Insert into navigation(pt_A, pt_B) values ('${pt_A}', '${pt_B}');`);
}

function createEvent(req, res) {
  cookieCreate(req, res).then(promise => {
    let button_id = req.body.buttonID;
    let cookie = req.cookies.visitor;
    let time_stamp = (new Date()).toString();

    if(promise.cookie){
      cookie = promise.cookie;
    }
    connection.query(`Insert into events(button_id, time_stamp, cookie) values ('${button_id}', '${time_stamp}', '${cookie}');`);
    res.sendStatus(200);
  });
}

// app.post('/navigation' function(req, res) {
//
//   connection.query(`Insert into navigation(pt_A, pt_B) values ('${pt_A}', '${pt_B}');`);
// })

app.listen(3000, () => console.log('Example app listening on port 3000!'))
