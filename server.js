var mysql = require('mysql');
var http = require('http');

console.log('SERVER: starting');

var con = mysql.createConnection({
    host: "localhost",
    user: "nodejs",
    password: "SQL123"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("SERVER: connected to mysql");
});

console.log("SERVER: created");
http.createServer((req, res) => { // Request, Response
    console.log('SERVER: response');
    res.setHeader("Access-Control-Allow-Origin", "*")
    con.query('SELECT * FROM winterloop.user', (e, r, f) => { // Error, Result, Field
        console.log(r);
        arr = new Array;
        r.forEach(ele => {
            arr.push({
                'id': ele.id,
                'naam': ele.naam,
                'huisnummer': ele.huisnummer,
                'postcode': ele.postcode,
                'telefoonnummer': ele.telefoonnummer,
                'vastBedrag': ele.vastBedrag,
                'rondeBedrag': ele.rondeBedrag,
                'rondes': ele.rondes,
                'code': ele.code,
                'create_time': ele.create_time
            });
        });
        res.write(JSON.stringify(arr));
        res.end();
    });
}).listen(4322);
