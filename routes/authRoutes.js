const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.get("/authenticate", authController.checkAuthenticated);

module.exports = router;
