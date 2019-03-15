const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
let auth = require('./authentication');
let share = require('./share');
let users = require('./users');
let db = require('./db-access');
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

app.all('/portal', auth.requiresLogin());
app.all('/profile', auth.requiresLogin());
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

app.get('/testchart', function(req, res) {
  res.render('testchart');
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

app.get('/charts/:chartType/:dataType', function(req, res) {
  console.log(req.params.chartType);
  console.log(req.params.dataType);
  db.getData(req.params.dataType).then(data => {
    res.send(data)
  });
})

app.get('/email', function(req, res) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cse135sendshared@gmail.com',
      pass: '1209Inter'
    }
  });

  var mailOptions = {
    from: 'vcannall@ucsd.edu',
    to: 'vcannall@ucsd.edu',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    attachments: { // encoded string as an attachment
      filename: 'shared.pdf',
      // content: `${req.body.pdf}`,
      content: `JVBERi0xLjMKJbrfrOAKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAxMzQ2Cj4+CnN0cmVhbQowLjU3IHcKMCBHCnEKcSBCVCAwIGcgNDIuNTIgNzgzLjI5IFRkCjAgLTI0LjAwIFRkCjAuMDAwIGcKL0YxMCAyNC4wMCBUZiAoVXNlciBEYXRhKSBUagpFVCBRCnEgQlQgMCBnIDYyLjUyIDczNC43MSBUZAowIC0xMi4wMCBUZAovRjkgMTIuMDAgVGYgKHZjYW5uYWxsQHVjc2QuZWR1KSBUago1Ni44MyA3MjYuNjAgbSA1Ni44MyA3MjcuNTYgNTYuMDUgNzI4LjM0IDU1LjA5IDcyOC4zNCBjCjU0LjEzIDcyOC4zNCA1My4zNSA3MjcuNTYgNTMuMzUgNzI2LjYwIGMKNTMuMzUgNzI1LjY0IDU0LjEzIDcyNC44NiA1NS4wOSA3MjQuODYgYwo1Ni4wNSA3MjQuODYgNTYuODMgNzI1LjY0IDU2LjgzIDcyNi42MCBjCkIKRVQgUQpxIEJUIDAgZyA2Mi41MiA3MTQuMjAgVGQKMCAtMTIuMDAgVGQKL0Y5IDEyLjAwIFRmIChWaW5jZW50KSBUago1Ni44MyA3MDYuMTAgbSA1Ni44MyA3MDcuMDYgNTYuMDUgNzA3Ljg0IDU1LjA5IDcwNy44NCBjCjU0LjEzIDcwNy44NCA1My4zNSA3MDcuMDYgNTMuMzUgNzA2LjEwIGMKNTMuMzUgNzA1LjE0IDU0LjEzIDcwNC4zNiA1NS4wOSA3MDQuMzYgYwo1Ni4wNSA3MDQuMzYgNTYuODMgNzA1LjE0IDU2LjgzIDcwNi4xMCBjCkIKRVQgUQpxIEJUIDAgZyA2Mi41MiA2OTMuNzAgVGQKMCAtMTIuMDAgVGQKL0Y5IDEyLjAwIFRmIChDYW5uYWxsYSkgVGoKNTYuODMgNjg1LjU5IG0gNTYuODMgNjg2LjU1IDU2LjA1IDY4Ny4zMyA1NS4wOSA2ODcuMzMgYwo1NC4xMyA2ODcuMzMgNTMuMzUgNjg2LjU1IDUzLjM1IDY4NS41OSBjCjUzLjM1IDY4NC42MyA1NC4xMyA2ODMuODUgNTUuMDkgNjgzLjg1IGMKNTYuMDUgNjgzLjg1IDU2LjgzIDY4NC42MyA1Ni44MyA2ODUuNTkgYwpCCkVUIFEKcSBCVCAwIGcgNjIuNTIgNjczLjE5IFRkCjAgLTEyLjAwIFRkCi9GOSAxMi4wMCBUZiAoMzU1NjQ5OCkgVGoKNTYuODMgNjY1LjA5IG0gNTYuODMgNjY2LjA1IDU2LjA1IDY2Ni44MyA1NS4wOSA2NjYuODMgYwo1NC4xMyA2NjYuODMgNTMuMzUgNjY2LjA1IDUzLjM1IDY2NS4wOSBjCjUzLjM1IDY2NC4xMyA1NC4xMyA2NjMuMzUgNTUuMDkgNjYzLjM1IGMKNTYuMDUgNjYzLjM1IDU2LjgzIDY2NC4xMyA1Ni44MyA2NjUuMDkgYwpCCkVUIFEKcSBCVCAwIGcgNjIuNTIgNjUyLjY5IFRkCjAgLTEyLjAwIFRkCi9GOSAxMi4wMCBUZiAoVHJ1ZSkgVGoKNTYuODMgNjQ0LjU5IG0gNTYuODMgNjQ1LjU1IDU2LjA1IDY0Ni4zMyA1NS4wOSA2NDYuMzMgYwo1NC4xMyA2NDYuMzMgNTMuMzUgNjQ1LjU1IDUzLjM1IDY0NC41OSBjCjUzLjM1IDY0My42MiA1NC4xMyA2NDIuODUgNTUuMDkgNjQyLjg1IGMKNTYuMDUgNjQyLjg1IDU2LjgzIDY0My42MiA1Ni44MyA2NDQuNTkgYwpCCkVUIFEKUQplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSIF0KL0NvdW50IDEKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKNiAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iago4IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGRPYmxpcXVlCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9Db3VyaWVyCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvQ291cmllci1Cb2xkCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjExIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvQ291cmllci1PYmxpcXVlCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjEyIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvQ291cmllci1Cb2xkT2JsaXF1ZQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxMyAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL1RpbWVzLVJvbWFuCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZwovRmlyc3RDaGFyIDMyCi9MYXN0Q2hhciAyNTUKPj4KZW5kb2JqCjE0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvVGltZXMtQm9sZAovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxNSAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL1RpbWVzLUl0YWxpYwovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKL0ZpcnN0Q2hhciAzMgovTGFzdENoYXIgMjU1Cj4+CmVuZG9iagoxNiAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL1RpbWVzLUJvbGRJdGFsaWMKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKMTcgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9aYXBmRGluZ2JhdHMKL1N1YnR5cGUgL1R5cGUxCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKMTggMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9TeW1ib2wKL1N1YnR5cGUgL1R5cGUxCi9GaXJzdENoYXIgMzIKL0xhc3RDaGFyIDI1NQo+PgplbmRvYmoKMiAwIG9iago8PAovUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL0ZvbnQgPDwKL0YxIDUgMCBSCi9GMiA2IDAgUgovRjMgNyAwIFIKL0Y0IDggMCBSCi9GNSA5IDAgUgovRjYgMTAgMCBSCi9GNyAxMSAwIFIKL0Y4IDEyIDAgUgovRjkgMTMgMCBSCi9GMTAgMTQgMCBSCi9GMTEgMTUgMCBSCi9GMTIgMTYgMCBSCi9GMTMgMTcgMCBSCi9GMTQgMTggMCBSCj4+Ci9YT2JqZWN0IDw8Cj4+Cj4+CmVuZG9iagoxOSAwIG9iago8PAovUHJvZHVjZXIgKGpzUERGIDEuNS4zKQovQ3JlYXRpb25EYXRlIChEOjIwMTkwMzE1MTUyNjEzLTA3JzAwJykKPj4KZW5kb2JqCjIwIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovT3BlbkFjdGlvbiBbMyAwIFIgL0ZpdEggbnVsbF0KL1BhZ2VMYXlvdXQgL09uZUNvbHVtbgo+PgplbmRvYmoKeHJlZgowIDIxCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMTUyMiAwMDAwMCBuIAowMDAwMDAzMzM5IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDEyNCAwMDAwMCBuIAowMDAwMDAxNTc5IDAwMDAwIG4gCjAwMDAwMDE3MDQgMDAwMDAgbiAKMDAwMDAwMTgzNCAwMDAwMCBuIAowMDAwMDAxOTY3IDAwMDAwIG4gCjAwMDAwMDIxMDQgMDAwMDAgbiAKMDAwMDAwMjIyNyAwMDAwMCBuIAowMDAwMDAyMzU2IDAwMDAwIG4gCjAwMDAwMDI0ODggMDAwMDAgbiAKMDAwMDAwMjYyNCAwMDAwMCBuIAowMDAwMDAyNzUyIDAwMDAwIG4gCjAwMDAwMDI4NzkgMDAwMDAgbiAKMDAwMDAwMzAwOCAwMDAwMCBuIAowMDAwMDAzMTQxIDAwMDAwIG4gCjAwMDAwMDMyNDMgMDAwMDAgbiAKMDAwMDAwMzU4NyAwMDAwMCBuIAowMDAwMDAzNjczIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMjEKL1Jvb3QgMjAgMCBSCi9JbmZvIDE5IDAgUgovSUQgWyA8ODA1OEYxQzM4MTMzOENCRTUzRjA4NzdCNjY5OTg4MUE+IDw4MDU4RjFDMzgxMzM4Q0JFNTNGMDg3N0I2Njk5ODgxQT4gXQo+PgpzdGFydHhyZWYKMzc3NwolJUVPRg==`,
      encoding: 'base64'
    },
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
})

app.post('/makelink', function(req, res) {
  console.log(req.body.encoded)
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
