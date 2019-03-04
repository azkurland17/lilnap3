const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
var useragent = require('useragent');
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

//creates a new client id (random number) that lasts for 15 min
app.get('/', function(req, res) {
  res.render('index', {
    locals: {
      title: 'Remembering Lil Napkin'
    }
  });
  // check if client sent cookie
  var cookie = req.cookies.cookieName;

  var browser = useragent.parse(req.headers['user-agent']);
  browser = browser.toAgent(); // 'Chrome 15.0.874

  var osVar = useragent.parse(req.headers['user-agent']);
  osVar = osVar.os.toString(); // 'Mac OSX 10.8.1'

  console.log(browser, osVar);

  if (cookie === undefined) {
    // no: set a new cookie
    var cookieID = Math.random().toString();
    cookieID = cookieID.substring(2, cookieID.length);
    res.cookie('cookieName', cookieID, {
      maxAge: 900000,
      httpOnly: true
    }); //only lasts for 15 min?
    console.log('cookie created successfully');
    console.log(osVar);

    connection.query(`insert into users(id, os, browser) values('${cookie}','${osVar}', '${browser}');`);
  } else {
    // yes, cookie was already present
    console.log('cookie exists', cookie);
    connection.query(`select * from users where id=${cookie};`, function(err, rows, fields) {
      if (err) console.log(err);
      if (!rows.length) {
        connection.query(`insert into users(id, os, browser) values('${cookie}','${osVar}', '${browser}');`);
      }
    });
  }

});

//event or error

app.post('/api/log/:logType', function(req, res) {
  let user;
  console.log(`select * from users where id=${req.cookies.cookieName};`);
  if (req.cookies) {
    connection.query(`select * from users where id=${req.cookies.cookieName};`, function(err, rows, fields) {
      console.log("wtffsf");
      if (rows) {
        user = rows[0];

        console.log(user);


        if (user.pattern) {
          user.pattern = user.pattern + "-" + req.body.buttonType;
        } else {
          user.pattern = req.body.buttonType;
        }

        if (user.logs) {
          user.logs = user.logs + "-" + req.body.logType;
        } else {
          user.logs = req.body.logType;
        }

        console.log(user);

        connection.query(`UPDATE users SET pattern = '${user.pattern}', logs = '${user.logs}' WHERE id = ${user.id};`);
      }
    });
  }
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
