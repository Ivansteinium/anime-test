'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
let names;

const { Pool } = require('pg');


let connectionString = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
};


const pool = new Pool(connectionString);

const queryselect = `
SELECT *
FROM anime
`;


pool.connect()
    .then((client) => {
        client.query(queryselect)
            .then(res => {
                names = res.rows;
                for (let row of res.rows) {
                    console.log(row);
                }
            })
            .catch(err => {
                console.error(err);
            });
    })
    .catch(err => {
        console.error(err);
    });


http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n' + res.connection.localPort + JSON.stringify(names));
}).listen(port);
