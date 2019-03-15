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

function login(email, password, sent_cookie) {
  console.log("cookie", sent_cookie)
  return new Promise((resolve, reject) => {
    users.userPass(email, password).then(matches => {
      if (matches) {
        //add cookie to logged_in_users
        //return cookie
        for (let cookie in logged_in_users) {
          if(logged_in_users[cookie] == email){
            delete logged_in_users[cookie];
          }
        }
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
    let user;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == cookie) {
        user = logged_in_users[arr[i]];
      }
    }
    if(user){
      users.isAdmin(user).then(adminStatus => {
        resolve(adminStatus)
      });
    } else {
      resolve(false);
    }
  });
}

function requiresLogin() {
  return [
    function(req, res, next) {
      console.log("authentication")
      if (isLoggedIn(req.cookies.cookie)) {
        next();
      } else {
        res.redirect('/');
      }
    }
  ]
}

function requiresAdmin(req, res, next) {
  return [
    function(req, res, next) {
      console.log("authentication")
      checkAdminStatus(req.cookies.cookie).then(isAdmin => {
        console.log("tesT", isAdmin)
        if(isAdmin){
          next();
        } else {
          res.redirect('/portal');
        }
      });
    }
  ]
}

function getUserFromCookie(cookie){
  return logged_in_users[cookie];
}

module.exports = {
  logged_in_users: logged_in_users,
  getCookie: getCookie,
  logout: logout,
  login: login,
  checkAdminStatus: checkAdminStatus,
  isLoggedIn: isLoggedIn,
  requiresLogin: requiresLogin,
  requiresAdmin: requiresAdmin,
  getUserFromCookie: getUserFromCookie
}
