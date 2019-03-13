let users = require('./users')

// array of cookies for logged in users
let logged_in_users = [];

// returns cookie for logging in user
function getCookie() {
  let cookie = Math.floor(Math.random() * 100000000);
  while (logged_in_users.includes(cookie)) {
    cookie = Math.floor(Math.random() * 100000000);
  }
  return cookie;
}

function isLoggedIn(cookie) {
  return logged_in_users.includes(cookie);
}

function login(email, password) {
  return new Promise((resolve, reject) => {
    users.userPass(email, password).then(matches => {
      if (matches) {
        //add cookie to logged_in_users
        //return cookie
        let cookie = getCookie();
        logged_in_users.push({
          email: email,
          cookie: cookie
        });
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
  let arr = logged_in_users;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].cookie === cookie) {
      arr.splice(i, 1);
      return true;
    }
  }
  return false;
}

function checkAdminStatus(cookie) {
  let arr = logged_in_users;
  return new Promise((resolve, reject) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].cookie === cookie) {
        users.isAdmin(arr[i].email).then(adminStatus => {
          resolve(adminStatus);
        });
      }
    }
  });
}

module.exports = {
  logged_in_users: logged_in_users,
  getCookie: getCookie,
  logout: logout,
  login: login,
  checkAdminStatus: checkAdminStatus,
  isLoggedIn: isLoggedIn
}
