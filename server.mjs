import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const Config = require('./configuration.json');

import { faker } from '@faker-js/faker/locale/nl';
import mysql from 'mysql2';
import express from 'express';
import util from 'util';
import cors from 'cors';

import bodyParser from 'body-parser';

const app = express().use('*', cors());
const port = Config.server.port;


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.disable("x-powered-by");

const con = mysql.createConnection(Config.mysql);

console.log('SERVER: starting');

// node native promisify
const query = util.promisify(con.query).bind(con);


con.connect(function (err) {
    (err) ? console.log("SERVER: Couldn't connect to SQL server") : null;
    if (err) throw err;
    console.log("SERVER: connected to mysql");
});

app.get('/', (req, res) => res.status(200).send('<h1>Server started successfully</h1>'))

async function genCode() {
    let code = Math.floor(100000 + Math.random() * 900000);
    const r = await query("SELECT COUNT(1) FROM winterloop.user WHERE code = ?;", [code]);
    console.log(r[0]["COUNT(1)"]);
    // console.log(r[""])
    if (r[0]["COUNT(1)"] == 0) {
        console.log(r);
        return code;
    } else {
        return genCode();
    }
}

app.get('/code/', async (req, res) => {
    const code = await genCode();
    res.status(200).send("success " + code);
})
app.get('/api/getUsers/', (req, res) => {
    con.query('SELECT * FROM winterloop.user ORDER BY naam', (e, r) => { // Error, Result
        console.log(r);
        const arr = new Array();
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
                'create_time': ele.create_time,
                'betaald': ele.betaald
            });
        });
        res.status(200).send(JSON.stringify(arr));
    });
})
app.post('/api/addUser/', async (req, res) => {
    const code = await genCode();
    const par = req.body; // get parameters from url
    con.query("INSERT INTO winterloop.user (`naam`,`huisnummer`,`postcode`,`telefoonnummer`,`vastBedrag`,`rondeBedrag`,`code`)" +
        " VALUES (?,?,?,?,?,?,?)", [par.naam, par.huisnummer, par.postcode, par.telefoonnummer, par.vastBedrag, par.rondeBedrag, code], (e) => {
            if (e) {
                res.status(500).send(e.sqlMessage);
            } else {
                res.status(200).send('{"code": ' + String(code) + '}');
            }
        });
});
app.post('/api/editUser/', async (req, res) => {
    const par = req.body; // get parameters from url
    con.query("UPDATE winterloop.user SET naam = ?, huisnummer = ?,postcode = ?,telefoonnummer = ?,vastBedrag = ?, rondeBedrag = ? WHERE id=?",
        [par.naam, par.huisnummer, par.postcode, par.telefoonnummer, par.vastBedrag, par.rondeBedrag, par.id], (e) => {
            if (e) {
                res.status(500).send(e.sqlMessage);
            } else {
                res.status(200).send('success');
            }
        });
});
app.post('/api/addRound/', async (req, res) => {
    const par = req.body; // get parameters from url
    con.query("UPDATE winterloop.user SET rondes = rondes + 1 WHERE code = ?", [par.code], (e) => {
        if (e) {
            res.status(500).send(e.sqlMessage);
        } else {
            res.status(200).send("success");
        }
    });
});
app.post('/api/setPayed/', async (req, res) => {
    const par = req.body; // get parameters from url
    con.query("UPDATE winterloop.user SET betaald = ? WHERE code = ?", [par.payed, par.code], (e) => {
        if (e) {
            res.status(500).send(e.sqlMessage);
        } else {
            res.status(200).send("success");
        }
    });
});

app.post('/api/removeRound/', async (req, res) => {
    const par = req.body; // get parameters from url
    con.query("UPDATE winterloop.user SET rondes = rondes - 1 WHERE code = ?", [par.code], (e) => {
        if (e) {
            res.status(500).send(e.sqlMessage);
        } else {
            res.status(200).send("success");
        }
    });
});
app.post('/api/setRound/', async (req, res) => {
    const par = req.body; // get parameters from url
    con.query("UPDATE winterloop.user SET rondes = ? WHERE code = ?", [par.rondes, par.code], (e) => {
        if (e) {
            res.status(500).send(e.sqlMessage);
        } else {
            res.status(200).send("success");
        }
    });
});
app.post('/api/removeUser/', async (req, res) => {
    console.log(req);
    const par = req.body;
    // check if user has paid
    con.query("SELECT betaald FROM winterloop.user WHERE code = ?", [par.code], (e, r) => {
        if (e) {
            res.status(500).send(e.sqlMessage);
            throw e;
        } else {
            if (r[0].betaald == 1) {
                res.status(500).send("User has already paid");
                throw "User has already paid";
            }

            con.query("DELETE FROM winterloop.user WHERE code = ?", [par.code], e => {
                if (e) {
                    res.status(500).send(e.sqlMessage);
                } else {
                    res.status(200).send("success");
                }
            });
        }
    })
});
app.post('/api/emptyDB/', async (req, res) => {
    console.log(req);
    con.query("DELETE FROM winterloop.user", e => {
        if (e) {
            res.status(500).send(e.sqlMessage);
        } else {
            res.status(200).send("success");
        }
    });
});

app.post('/api/fillDB/', async (req, res) => {
    // randomly fills database
    const par = req.body;
    console.log(req);
    for (let i = 0; i < par.count; i++) {
        const code = await genCode();
        const person = [
            faker.name.fullName(),
            faker.address.buildingNumber().replace("[a-zA-Z]", ""),
            faker.address.zipCode().replace(" ", ""),
            faker.phone.number(),
            (Math.random() * 1000.00).toFixed(2),
            (Math.random() * 1000.00).toFixed(2),
            code
        ]
        con.query("INSERT INTO winterloop.user (`naam`,`huisnummer`,`postcode`,`telefoonnummer`,`vastBedrag`,`rondeBedrag`,`code`)" +
            " VALUES (?,?,?,?,?,?,?)", person, (e) => {
                if (e) {
                    res.status(500).send(e.sqlMessage);
                }
                console.log(person);
            });
    }
    res.status(200).send('success');
});

app.listen(port, () => console.log(`Server started, listening on port ${port}!`))
