const mysql = require('mysql');
const express = require('express')
const app = express()
const port = 4322
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

console.log('SERVER: starting');

var con = mysql.createConnection({
    host: "localhost", //change this
    user: "nodejs", //change this
    password: "SQL123" //change this
});

con.connect(function (err) {
    if (err) throw err;
    console.log("SERVER: connected to mysql");
});

app.use(function (req, res, next) { // allow the cors
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/', (req, res) => res.status(200).send('<h1>Server started successfully</h1>'))
app.get('/code/', (req, res) => {
    var result = false;
    var num = 0;

    // while (!result || num > 1000) {
        var code = Math.floor(100000 + Math.random() * 900000);
        con.query("SELECT COUNT(1) FROM winterloop.user WHERE code = ?;", [code], (e, r, f) => { // Error, Result, Field
            console.log(num);
            console.log(result);
            num++;
            if (e) {
                res.status(500).send(e.sqlMessage);
            }else {
                console.log(r);
                res.status(200).send("success " + code + "  " + r[0]["COUNT(1)"]);
                if (r[0]["COUNT(1)"] == 0) {
                    result = true;
                    console.log(result);
                    break
                }
            }
        });
    // }

    // res.status(500).send("oops, internal server error.");
})
app.get('/api/getUsers/', (req, res) => {
    con.query('SELECT * FROM winterloop.user', (e, r, f) => { // Error, Result, Field
        console.log(r);
        var arr = new Array;
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
    });
    res.status(200).send(JSON.stringify(arr));
})
app.post('/api/addUser/', (req, res) => {
    con.query("INSERT INTO winterloop.user (`id`,`naam`,`huisnummer`,`postcode`,`telefoonnummer`,`vastBedrag`,`rondeBedrag`,`code`)"
    + " VALUES (?,?,?,?,?,?,?,?)", [par.id,par.naam,par.huisnummer,par.postcode,par.telefoonnummer,par.vastBedrag,par.rondeBedrag,code], (e, r, f) => { // Error, Result, Field
        if (e) {
            res.status(500).send(e.sqlMessage);
        }else {
            res.status(200).send("success");
        }
    })
    var code = '123456';
    var par = req.body; // get parameters from url
    con.query("INSERT INTO winterloop.user (`id`,`naam`,`huisnummer`,`postcode`,`telefoonnummer`,`vastBedrag`,`rondeBedrag`,`code`)"
    + " VALUES (?,?,?,?,?,?,?,?)", [par.id,par.naam,par.huisnummer,par.postcode,par.telefoonnummer,par.vastBedrag,par.rondeBedrag,code], (e, r, f) => { // Error, Result, Field
        if (e) {
            res.status(500).send(e.sqlMessage);
        }else {
            res.status(200).send("success");
        }
    });
});

app.listen(port, () => console.log(`Server started, listening on port ${port}!`))
