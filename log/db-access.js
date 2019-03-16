var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'logs',
  user: 'root',
  password: 'rootroot',
});

connection.connect(function(err) {
  console.log('DB-Access is connected as id ' + connection.threadId);
});

function getEnvData() {
  let ret_data = {}
  return new Promise((resolve, reject) => {
    connection.query(`select os, count(os) as count from environment group by os;`, function(err, rows, fields) {
      ret_data['os'] = rows;
      connection.query(`select browser, count(browser) as count from environment group by browser;`, function(err, rows, fields) {
        ret_data['browser'] = rows;
        resolve(ret_data);
      })
    })
  });
}

function getPerformanceData() {
  let ret_data = {};
  return new Promise((resolve, reject) => {
    connection.query(`select e.browser, avg(p.render_time) as time from performance p, environment e where p.cookie = e.cookie group by e.browser order by time asc;`, function(err, rows, fields) {
      ret_data['avgBrowser'] = rows;
      connection.query(`select e.os, avg(p.render_time) as time from performance p, environment e where p.cookie = e.cookie group by e.os order by time asc;`, function(err, rows, fields) {
        ret_data['avgOS'] = rows;
        connection.query(`select page_source, avg(render_time) as time from performance group by page_source order by time asc;`, function(err, rows, fields) {
          ret_data['avgTimePerPage'] = rows;
          connection.query(`select time_stamp, render_time from performance order by time_stamp asc;`, function(err, rows, fields) {
            ret_data['timeperrender'] = modTime(rows);
            resolve(ret_data)
          })
        })
      })
    })
  });
}

function modTime(rows) {
  console.log(typeof rows)
  let times = new Array(24).fill(0);
  for(var i in rows){
    let date = new Date(rows[i].time_stamp);
    let hour = date.getHours();
    times[hour] = (times[hour])? times[hour] += 1: 1;
  }



  return times;

}

module.exports = {
  getEnvData: getEnvData,
  getPerformanceData: getPerformanceData
}
