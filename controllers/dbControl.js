const { Pool } = require("pg");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
    "1026437203141-p6tbqfjv4nr7r0p9m783lk1ukh6h2924.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const queryselectallanime = `
select animeid, title, studio, description, imageURL, SUM (rating) AS rating from AnimeData natural left join AnimeRating group by animeid;
`;

const querysingleanime = `
select animeid, title, studio, description, imageURL, SUM (rating) AS rating, backgroundURL from AnimeData natural left join AnimeRating where animeid=$1 group by animeid;
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
pool.connect()
    .then(() => console.log("Database connection established..."))
    .catch((e) => console.log(e));

module.exports.add_rating = async (req, res) => {
	const token = req.cookies["session-token"];
	console.log(token);
    console.log(req.cookies);
	console.log(req.headers.cookie);
	
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        return ticket.playload.sub;
    }

    let googleid;
    try {
        googleid = await verify();
    }
    catch(err) {
		console.log(err);
        res.status(401).send('Unauthorized');
		return;
    }

    const { animeid, rating } = req.body;

    try {
        const animes = await pool.query(insertratingquery, [googleid, animeid, rating]);
        res.status(201).send(`User added with ID: ${animes.insertId}`);
    } catch (err) {
        console.error(err);
    }
    //client
    //    .query(insertratingquery, [googleid, animeid, rating])
    //    .then((animes) => {
    //        res.status(201).send(`User added with ID: ${animes.insertId}`);
    //    })
    //    .catch((err) => {
    //        console.error(err);
    //    });
};

module.exports.list_anime = async (req, res) => {
    try {
        const animes = await pool.query(queryselectallanime);
        res.status(200).json(animes.rows);
    } catch(err) {
        console.error(err);
    }
    //client
    //    .query(queryselectallanime)
    //    .then((animes) => {
    //        res.status(200).json(animes.rows);
    //    })
    //    .catch((err) => {
    //        console.error(err);
    //    });

};

module.exports.list_single_anime = async (req, res) => {
    try {
        const animes = await pool.query(querysingleanime, [req.params.id]);
        res.status(200).json(animes.rows);
    } catch(err) {
        console.error(err);
    }
    
    //client
    //    .query(querysingleanime, [req.params.id])
    //    .then((animes) => {
    //        res.status(200).json(animes.rows);
    //    })
    //    .catch((err) => {
    //        console.error(err);
    //    });
};

module.exports.addUser = async (googleId) => {
    const animes = await pool.query(insertuserquery, [googleId]);
    return animes.insertId;
};

module.exports.checkIfUserExists = async (googleId) => {
    const res = await pool.query(getUserQuery, [googleId]);
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
