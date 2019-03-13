var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'users',
  user: 'root',
  password: 'rootroot',
});

connection.connect(function(err) {
  console.log('Users is connected as id ' + connection.threadId);
});


// used for hashing passwords!!!!!!!
String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// will check if user with specified email exists in database
function userExists(email) {
  console.log(`Checking if user: '${email}' exists`)
  return new Promise((resolve, reject) => {
    connection.query(`select * from auth where email='${email}';`, function(err, rows, fields) {
      let exists = (rows.length) ? true : false;
      resolve(exists);
    });
  });
}

//creates new user objects in database, need to be in the following format
// +------------+-------------+------+-----+---------+-------+
// | Field      | Type        | Null | Key | Default | Extra |
// +------------+-------------+------+-----+---------+-------+
// | email      | varchar(50) | YES  |     | NULL    |       |
// | password   | varchar(50) | YES  |     | NULL    |       |
// | first_name | varchar(50) | YES  |     | NULL    |       |
// | last_name  | varchar(50) | YES  |     | NULL    |       |
// | admin      | tinyint(1)  | YES  |     | NULL    |       |
// +------------+-------------+------+-----+---------+-------+
function makeNewUser(userObj) {
  console.log("making new user");
  return new Promise((resolve, reject) => {
    userExists(userObj.email).then(exists => {
      if (!exists) {
        connection.query(`insert into auth(email, password, first_name, last_name, admin) values('${userObj.email}','${userObj.password.hashCode()}','${userObj.first_name}','${userObj.last_name}',${userObj.admin})`, function(err, rows, fields) {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  });
}

// deletes user with matching email
function deleteUser(email) {
  console.log(`deleting user: ${email}`);
  return new Promise((resolve, reject) => {
    connection.query(`delete from auth where email='${email}'`, function(err, rows, fields) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// checks if password matches given email
function userPass(email, password) {
  return new Promise((resolve, reject) => {
    connection.query(`select * from auth where email='${email}';`, function(err, rows, fields) {
      if (rows.length) {
        // check if password in DB for given user matches entered password
        let db_password = rows[0].password;
        let entered_password = password.hashCode();
        let exists = (db_password == entered_password) ? true : false;
        resolve(exists);
      } else {
        resolve(false)
      }
    });
  });
}

function isAdmin(email){
  return new Promise((resolve, reject) => {
    connection.query(`select admin from auth where email='${email}';`, function(err, rows, fields) {
      if (rows) {
        // check if password in DB for given user matches entered password
        let exists = (rows[0].admin) ? true : false;
        resolve(exists);
      } else {
        resolve(false)
      }
    });
  });
}

module.exports = {
  userExists: userExists,
  makeNewUser: makeNewUser,
  deleteUser: deleteUser,
  userPass: userPass,
  isAdmin: isAdmin
}
