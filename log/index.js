const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const app = express()
var cookieSecret = "lilnapkin";
app.use(cookieParser(cookieSecret))


app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     database : 'dbname',
//     user     : 'username',
//     password : 'password',
// });
//
// connection.connect(function(err) {
//     if (err) {
//         console.error('Error connecting: ' + err.stack);
//         return;
//     }
//
//     console.log('Connected as id ' + connection.threadId);
// });


app.get('/', function(req, res) {
  res.render('index', {
    locals: {
      title: 'Log page yo'
    }
  });
});



// app.get('/cookie', function(req, res) {
//   var cookies = setCookie.parse(res, {
//   decodeValues: true  // default: true
// });

console.log("hiiiii");
app.listen(4000, () => console.log('Example app listening on port 4000!'))
