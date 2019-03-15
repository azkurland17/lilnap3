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
  console.log(`select * from users where email='${email}';`)
  return new Promise((resolve, reject) => {
    connection.query(`select * from users where email='${email}';`, function(err, rows, fields) {
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
        connection.query(`insert into users(email, password, first_name, last_name, admin) values('${userObj.email}','${userObj.password.hashCode()}','${userObj.first_name}','${userObj.last_name}',${userObj.admin})`, function(err, rows, fields) {
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
    connection.query(`delete from users where email='${email}'`, function(err, rows, fields) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function readUsers() {
  console.log("returning list of users");
  return new Promise((resolve, reject) => {
    connection.query(`select * from users ORDER BY first_name ASC;`, function(err, rows, fields) {
      resolve(rows);
    });
  });
}

function renderUsers() {
  let html;
  return new Promise((resolve, reject) => {
    readUsers().then(users => {
      users.map(user => {
        html += `
      <tr>
        <td>
        </td>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
        <td>${(user.admin)? 'True': 'False'}</td>
        <td>
          <a href="#editEmployeeModal" class="edit" data-toggle="modal" onclick="populateEdit(${(JSON.stringify(user)).split("\"").join("\'")})"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
          <a href="#deleteEmployeeModal" class="delete" data-toggle="modal" onclick="initializeDelete(\'${user.email}\')"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
        </td>
      </tr>
      `
      });
      resolve(html);
    })
  });
}

// checks if password matches given email
function userPass(email, password) {
  return new Promise((resolve, reject) => {
    connection.query(`select * from users where email='${email}';`, function(err, rows, fields) {
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

function isAdmin(email) {
  return new Promise((resolve, reject) => {
    let isAdmin = false;
    connection.query(`select admin from users where email='${email}';`, function(err, rows, fields) {
      if (rows) {
        // check if password in DB for given user matches entered password
        isAdmin = (rows[0].admin) ? true : false;
      } else {
        isAdmin = false;
      }
      resolve(isAdmin);
    });
  });
}

// {
//   email: 'azkur17@ucsd.edu',
//   password: '3556498',
//   first_name: 'test',
//   last_name: 'test',
//   admin: 1
// }

function updateUser(userObj){
  return new Promise((resolve, reject) => {
    console.log(userObj);
    let query;
    if(userObj.password){
      query = `UPDATE users SET password = '${userObj.password.hashCode()}', first_name = '${userObj.first_name}', last_name='${userObj.last_name}', admin='${userObj.admin}' WHERE email='${userObj.email}';`;
      console.log('PASSWORD');
    } else {
      query = `UPDATE users SET first_name = '${userObj.first_name}', last_name='${userObj.last_name}', admin='${userObj.admin}' WHERE email='${userObj.email}';`;
      console.log("NO PASSWORD!!!");
    }
    connection.query(query);
    resolve();
  });
}

function getUser(user){
  return new Promise((resolve, reject) => {
    console.log("in getuser");
    console.log(user);
    connection.query(`select`);
  });
}

module.exports = {
  userExists: userExists,
  makeNewUser: makeNewUser,
  deleteUser: deleteUser,
  userPass: userPass,
  isAdmin: isAdmin,
  renderUsers: renderUsers,
  updateUser: updateUser,
  getUser: getUser
}
