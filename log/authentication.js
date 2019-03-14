let users = require('./users')

// array of cookies for logged in users
let logged_in_users = {};

// returns cookie for logging in user
function getCookie() {
  let cookie = Math.floor(Math.random() * 100000000);
  while (Object.keys(logged_in_users).includes(cookie)) {
    cookie = Math.floor(Math.random() * 100000000);
  }
  return cookie;
}

function isLoggedIn(cookie) {
  return Object.keys(logged_in_users).includes(cookie);
}

function login(email, password, cookie) {
  return new Promise((resolve, reject) => {
    users.userPass(email, password).then(matches => {
      if (matches) {
        //add cookie to logged_in_users
        //return cookie
        let cookie = getCookie();
        logged_in_users[cookie] = email;
        resolve({
          cookie: cookie
        });
      } else {
        resolve({
          error: "password did not match user"
        });
      }
    });
  });
}

function logout(cookie) {
  console.log(`logging out user with cookie ${cookie}`);
  let arr = Object.keys(logged_in_users);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == cookie) {
      delete logged_in_users[arr[i]];
      return true;
    }
  }
  return false;
}

function checkAdminStatus(cookie) {
  let arr = Object.keys(logged_in_users);
  return new Promise((resolve, reject) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == cookie) {
        users.isAdmin(logged_in_users[arr[i]]).then(adminStatus => {
          resolve(adminStatus);
        });
      }
    }
  });
}

function requiresLogin() {
  return [
    function(req, res, next) {
      console.log("authentication")
      if (isLoggedIn(req.cookies.cookie)) {
        next();
      } else
        res.render('login');
    }
  ]
}

function requiresAdmin() {
  return [
    function(req, res, next) {
      console.log("authentication")
      if (checkAdminStatus(req.cookies.cookie)) {
        next();
      } else
        res.render('login');
    }
  ]
}

module.exports = {
  logged_in_users: logged_in_users,
  getCookie: getCookie,
  logout: logout,
  login: login,
  checkAdminStatus: checkAdminStatus,
  isLoggedIn: isLoggedIn,
  requiresLogin: requiresLogin,
  requiresAdmin: requiresAdmin
}
