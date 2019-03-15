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

function getData(dataType){
  return new Promise((resolve, reject) => {
    console.log(`select ${dataType}, count(${dataType}) as ${dataType} from environment group by ${dataType};`)
    connection.query(`select ${dataType}, count(${dataType}) as count from environment group by ${dataType};`, function(err, rows, fields){
      resolve(rows);
    })
  });
}

module.exports = {
  getData: getData
}
