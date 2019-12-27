var mysql = require('mysql');
var http = require('http');

console.log('SERVER: starting');

var con = mysql.createConnection({
  host: "localhost",
  user: "demo",
  password: "password"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("SERVER: connected to mysql");
});

console.log("SERVER: created");
http.createServer((req, res) => { // Request, Response
  console.log('SERVER: response');
  con.query('SELECT naam FROM winterloop.user', (e, r, f) => { // Error, Result, Field
    console.log(r);
    res.write('Response from server: ');
    r.forEach(ele => {
      res.write(ele.naam + ' ');
    });
    res.end();
  });
}).listen(8080);