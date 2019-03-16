var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'pdfs',
  user: 'root',
  password: 'rootroot',
});

connection.connect(function(err) {
  console.log('Share is connected as id ' + connection.threadId);
});

function makeLink(base64){
  let link = "http://localhost:4000/viewpdf/";
  let hash = Math.floor(Math.random() * 100000000);
  console.log(base64)
  return new Promise((resolve, reject) => {
    connection.query(`insert into pdfs (hash, encoding) values ('${hash}', '${base64}');`, function(err, rows, fields){
      resolve(link + hash);
    });
  });
}

function renderPDF(hash){
  return new Promise((resolve, reject) => {
    connection.query(`select * from pdfs where hash='${hash}';`, function(err, rows, fields){
      resolve(rows[0].encoding);
    });
  });
}

module.exports = {
  makeLink: makeLink,
  renderPDF: renderPDF
}
