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


//creates a new client id (random number) that lasts for 15 min
app.get('/', function(req, res) {
  res.render('index', {
    locals: {
      title: 'Remembering Lil Napkin'
    }
  });
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie('cookieName', randomNumber, {
      maxAge: 900000,
      httpOnly: true
    }); //only lasts for 15 min?
    console.log('cookie created successfully');
  } else {
    // yes, cookie was already present
    console.log('cookie exists', cookie);
  }

});

//event or error



app.post('/api/log/:logType', function(req, res) {
  var logtype = req.params.logType; //can be body, event, error
  var userID = req.cookies.cookieName; //clients ID

  var osVar = useragent.parse(req.headers['user-agent']);
  osVar = osVar.os.toString(); // 'Mac OSX 10.8.1'

  var browser = useragent.parse(req.headers['user-agent']);
  browser = browser.toAgent(); // 'Chrome 15.0.874

  var button = req.body.buttonType;

  var user = 1; //TODO read from the database to see if user exists
  var pattern = "pointless-learn"; //read the pattern in the database
  //example pattern: pointless-donate-learn-donate

  //if pattern is null -- insert first pattern button
  if(pattern == null){
    //insert the pattern word into the table for that user, will always be "pointless"
    pattern = button;
  }
  else{
    //else add to and check pattern
    //build up the string of buttons (for ordering)
    pattern = pattern.concat("-");
    pattern = pattern.concat(button);

    //firstB = first button that was clicked
    //if donate occurs after learn more, add to db
    var first = false;
    var ret = false;
    var b = pattern.split("/"),
      i;
    for (i = 0; i < b.length; i++) {
      if (b[i] === "learn") {
        first = true;
      }
      if (first) {
        if (b[i] === "donate") {
          ret = true;
        }
      }
    }
    ///ret = true if donate occurs after learn (insert in table)
    //b[1] is the first user click (because b[0] is when page is loaded) (insert in table)
    //console.log(pattern);
  }



  //there are all the variables you would want for the table^^^
  //console.log(req.body.buttonType); //ex) pointless(just reloaded no button clicked), donate, erroneousFunction...
  //console.log(logtype);
  // console.log(userID);
  // console.log(osVar);
  // console.log(browser);


  //
  // connection.query('insert into infoTable (columnName1, columnName2) values (value1, value2)', function(error, results, fields) {
  //   if (error)
  //     throw error;
  //
  //   results.forEach(result => {
  //     console.log(result);
  //   });
  // });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
