var mysql          = require('mysql');
var http           = require('http');
var HttpDispatcher = require('httpdispatcher');
var dispatcher     = new HttpDispatcher();
var url            = require('url');

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

console.log("SERVER: created");

const PORT = 4322;

// handle requests and send response
function handleRequest(request, response) {
    try {
        // log the request on console
        console.log(request.url);
        // Dispatch
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

var server = http.createServer(handleRequest);

dispatcher.onGet("/", function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "*"});
    res.end('<h1>Server started successfully</h1>');
});

dispatcher.onGet("/api/getUsers/", function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "*"});
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
});
dispatcher.onGet("/api/addUser/", function (req, res) {
    var code = '123456';
    res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "*"});
    var par = url.parse(req.url); // get parameters from url
    con.query('INSERT INTO `members` (`id`,`naam`,`huisnummer`,`postcode`,`telefoonnummer`,`vastBedrag`,`rondeBedrag`,`code`)'
    + ' VALUES (`' + par.id + '`,`' + par.naam + '`,`' + par.huisnummer + '`,`' + par.postcode + '`,`' + par.telefoonnummer + '`,`' + par.vastBedrag + '`,`' + par.rondeBedrag + '`,`' + code + '`)', (e, r, f) => { // Error, Result, Field
        res.end();
    });// werkt nog niet
});
dispatcher.onError(function (req, res) {
    res.writeHead(404);
    res.end("Error, the URL doesn't exist");
});

server.listen(PORT);
