const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
let auth = require('./authentication');
let users = require('./users');
const app = express()
var cookieSecret = "lilnapkin";
app.use(cookieParser(cookieSecret))

app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/favicon', express.static('favicon'));
app.use('/vendor', express.static('vendor'));
app.use('/css', express.static('css'));
app.use('/fonts', express.static('fonts'));
// app.use('/vendor/*', express.static('vendor/'));


app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://104.248.219.235:4000/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST');

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
  database: 'users',
  user: 'root',
  password: 'rootroot',
});

connection.connect(function(err) {
  console.log('Connected as id ' + connection.threadId);
});


app.get('/', function(req, res) {
  res.render('index', {
    locals: {
      title: 'Log page yo'
    }
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/data', function(req, res) {
  if (req.body.user && req.body.user === "alex" && req.body.pass && req.body.pass === "iscool") {
    console.log("SEND THAT DAAAAYTAA");
    connection.query(`select * from users;`, function(err, rows, fields) {
      console.log(rows)
      res.send(JSON.stringify(rows))
    });
  }
});

// app.get('/cookie', function(req, res) {
//   var cookies = setCookie.parse(res, {
//   decodeValues: true  // default: true
// });



//tests
users.userExists('vcannall@ucsd.edu').then(function(value) {
  console.log('test', value)
})

let userObj = {
  email: 'azkur17@ucsd.edu',
  password: 'test',
  first_name: 'test',
  last_name: 'test',
  admin: 1
};

users.makeNewUser(userObj).then(value => {
  console.log("created new user", value);
  users.userPass(userObj.email, userObj.password).then(value => {
    console.log("user matches pass", value);
    // users.deleteUser('azkur17@ucsd.edu').then(value => {
    //   console.log("deleted user", value);
    // })
  })
})

auth.login(userObj.email, userObj.password).then(msg => {
  let cookie = msg.cookie;
  console.log(msg.cookie, msg.error);
  console.log(auth.logged_in_users);
  if (cookie) {
    auth.checkAdminStatus(cookie).then(adminStatus => {
      console.log("admin status", adminStatus)
    })
    console.log(auth.logout('32523'));
    console.log(auth.logged_in_users);
    console.log(auth.logout(cookie));
    console.log(auth.logged_in_users);
  }
})

app.listen(4000, () => console.log('Example app listening on port 4000!'));
