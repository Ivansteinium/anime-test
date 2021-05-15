const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "1026437203141-p6tbqfjv4nr7r0p9m783lk1ukh6h2924.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

module.exports.login_post = async (req, res) => {
  const token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  }

  await verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
};
