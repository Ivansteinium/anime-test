const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "1026437203141-p6tbqfjv4nr7r0p9m783lk1ukh6h2924.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const maxAge = 3 * 24 * 60 * 60;

module.exports.checkAuthenticated = (req, res) => {
  let token = req.cookies["session-token"];

  async function verify() {
    await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
  }
  verify()
    .then(() => {
      res.send("authorized");
    })
    .catch((err) => {
      res.send("unauthorized");
    });
};

module.exports.login_post = async (req, res) => {
  const token = req.body.token;

  async function verify() {
    await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
  }

  await verify()
    .then(() => {
      res.cookie("session-token", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.send("success");
    })
    .catch(console.error);
};

module.exports.logout_get = (req, res) => {
  res.cookie("session-token", "", { maxAge: 1 });
  res.send();
};
