const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
let auth = require('./authentication');
let share = require('./share');
let visitation = require('./visitation');
let users = require('./users');
let db = require('./db-access');
var cytoscape = require('cytoscape');
var nodemailer = require('nodemailer');
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
  limit: 90000000000000000*1000000
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

app.all('/portal', auth.requiresLogin());
app.all('/profile', auth.requiresLogin());
app.all('/reports/*', auth.requiresLogin());
app.all('/admin', auth.requiresAdmin());
app.all('/users/*', auth.requiresAdmin());

app.get('/', function(req, res) {
  res.render('login');
});

app.get('/portal', function(req, res) {
  res.render('portal');
})

app.get('/admin', function(req, res) {
  users.renderUsers().then(html => {
    res.render('admin', {
      locals: {
        users: html
      }
    });
  });
});

app.get('/profile', function(req, res) {
  users.getUser(auth.getUserFromCookie(req.cookies.cookie)).then(userInfo => {
    res.render('profile', {
      locals: {
        userInfo: userInfo
      }
    });
  })
})

app.get('/reports/performance', function(req, res) {
  res.render('performance');
})

app.get('/reports/piechart', function(req, res) {
  res.render('piechart');
})

app.get('/loaduser', function(req, res) {
  users.getUser(auth.getUserFromCookie(req.cookies.cookie)).then(userInfo => {
    res.send({
      userInfo: userInfo
    });
    res.sendStatus(200);
  })
})

app.post('/login', function(req, res) {
  let response = {
    path: ""
  };
  auth.login(req.body.email, req.body.pass, req.cookies.cookie).then(cookie => {
    if (cookie.cookie) {
      res.cookie('cookie', cookie.cookie, {
        maxAge: 900000,
        httpOnly: true
      });
      console.log(`${req.body.email} successfully logged in!`)
      console.log(auth.logged_in_users);
      response.path = '/portal';
    } else {
      response.path = '/';
    }
    res.send(JSON.stringify(response));
  })
})

app.post('/logout', function(req, res) {
  let response = {
    path: "/"
  };
  auth.logout(req.cookies.cookie);
  res.clearCookie('cookie');
  res.send(JSON.stringify(response));
});

app.post('/data', function(req, res) {
  console.log("SEND THAT DAAAAYTAA");
  connection.query(`select * from users;`, function(err, rows, fields) {
    console.log(rows)
    res.send(JSON.stringify(rows))
  });
});

app.put('/users/updateuser', function(req, res) {
  users.updateUser(req.body.user_obj);
  res.sendStatus(200);
});

app.delete('/users/deleteuser/:user', function(req, res) {
  users.deleteUser(req.params.user).then(result => {
    res.sendStatus(200);
  });
});

app.post('/users/createuser', function(req, res) {
  users.makeNewUser(req.body.user_obj).then(result => {
    res.sendStatus(200);
  })
});

app.get('/visitation', function(req, res) {
  res.render('visitation');
})

app.get('/charts/:chartType', function(req, res) {
  console.log(req.params.chartType);
  switch (req.params.chartType) {
    case 'performance':
      db.getPerformanceData().then(data => {
        res.send(data)
      });
      break;
    case 'environment':
      db.getEnvData().then(data => {

        res.send(data)
      });
      break;
    case 'visitation':
      visitation.getData().then(data => {
        res.send(data);
      });
  }
});

app.post('/email', function(req, res) {
  console.log(req.body.pdf);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cse135sendshared@gmail.com',
      pass: '1209Inter'
    }
  });

  var mailOptions = {
    from: 'vcannall@ucsd.edu',
    to: `${req.body.email}`,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    attachments: { // encoded string as an attachment
      filename: 'shared.pdf',
      content: `${req.body.pdf}`,
      encoding: 'base64'
    },
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
      console.log('Email sent: ' + info.response);
    }
  });
})

app.post('/makelink', function(req, res) {
  share.makeLink(req.body.encoded).then(link => {
    res.send(link);
  })
});

app.get('/viewpdf/:hash', function(req, res) {
  share.renderPDF(req.params.hash).then(iframesrc => {
    res.render('pdf', {
      locals: {
        iframesrc: iframesrc
      }
    });
  });
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
