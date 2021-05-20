const { Pool } = require("pg");

const queryselectallanime = `
select animeid, title, studio, description, imageURL, SUM (rating) AS rating from AnimeData natural left join AnimeRating group by animeid;
`;

const querysingleanime = `
select animeid, title, studio, description, imageURL, SUM (rating) AS rating from AnimeData natural left join AnimeRating where animeid=$1 group by animeid;
`;


const insertuserquery = `
INSERT INTO Users (googleid) VALUES ($1)
`;

const insertratingquery = `
INSERT INTO AnimeRating(userid, animeid, rating) VALUES((SELECT userid FROM Users WHERE googleid = $1), $2, $3)
`;

const getUserQuery = `
SELECT * FROM Users WHERE googleid = $1
`;

const port = process.env.PORT || 1337;

let connectionString = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connectionString);

module.exports.add_rating = (req, res) => {
        async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        return ticket.playload.sub;
    }

    try {
        const googleid = await verify();
    }
    catch(err) {
        res.status(401).send('Unauthorized');
    }

    const { animeid, rating } = req.body;
    pool
        .connect()
        .then((client) => {
            client
                .query(insertratingquery, [googleid, animeid, rating])
                .then((animes) => {
                    res.status(201).send(`User added with ID: ${animes.insertId}`);
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

module.exports.list_single_anime = async (req, res) => {
    pool
        .connect()
        .then((client) => {
            client
                .query(querysingleanime, [req.params.id])
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

module.exports.addUser = async (googleId) => {
    const client = await pool.connect();
    const animes = await client.query(insertuserquery, [googleId]);
    return animes.insertId;
};

module.exports.checkIfUserExists = async (googleId) => {
    const client = await pool.connect();
    const res = await client.query(getUserQuery, [googleId]);
	console.log(typeof googleId);
	console.log(res);
    console.log(res.rows.length);
    return res.rows.length === 1;
};

module.exports.add_user = async (req, res) => {
    const { googleid } = req.body;
    try {
        const id = await this.addUser(googleid);
        res.status(201).send(`User added with ID: ${animes.insertId}`);
    } catch (err) {
        console.error(err);
    }
};
