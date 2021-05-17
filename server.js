"use strict";
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { OAuth2Client } = require("google-auth-library");

const port = process.env.PORT || 1337;
let names;

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

let connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connectionString);

const queryselect = `
SELECT *
FROM anime
`;

pool
  .connect()
  .then((client) => {
    client
      .query(queryselect)
      .then((res) => {
        names = res.rows;
        for (let row of res.rows) {
          console.log(row);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });

app.use(authRoutes);

// http
//   .createServer((req, res) => {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Hello World\n" + res.connection.localPort + JSON.stringify(names));
//   })
//   .listen(port);

app.listen(port, () => {
  console.log("server running...");
});
