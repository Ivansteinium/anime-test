const { Pool } = require("pg");

const queryselectallanime = `
SELECT *
FROM AnimeData
`;

const insertuserquery = `
INSERT INTO Users (googleid) VALUES ($1)
`;

const insertratingquery = `
INSERT INTO AnimeRating(userid, animeid, rating) VALUES((SELECT userid FROM Users WHERE googleid = $1), $2, $3)
`;


const port = process.env.PORT || 1337;


let connectionString = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connectionString);


module.exports.add_rating = (req, res) => {
    const { googleid, animeid, rating } = req.body
    pool
        .connect()
        .then((client) => {
            client
                .query(insertratingquery, [googleid, animeid, rating])
                .then((animes) => {
                    res.status(201).send(`User added with ID: ${animes.insertId}`)
                })
                .catch((err) => {
                    console.error(err);
                });
        })
        .catch((err) => {
            console.error(err);
        });

};

module.exports.list_anime = async (req, res) => {
    pool
        .connect()
        .then((client) => {
            client
                .query(queryselectallanime)
                .then((animes) => {
                    res.status(200).json(animes.rows);
                })
                .catch((err) => {
                    console.error(err);
                });
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports.add_user = (req, res) => {
    const { googleid } = req.body
    pool
        .connect()
        .then((client) => {
            client
                .query(insertuserquery, [googleid])
                .then((animes) => {
                    res.status(201).send(`User added with ID: ${animes.insertId}`)
                })
                .catch((err) => {
                    console.error(err);
                });
        })
        .catch((err) => {
            console.error(err);
        });
};
