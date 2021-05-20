const { Router } = require("express");
const dbController = require("../controllers/dbControl");

const router = Router();

router.post("/addUser", dbController.add_user);
router.get("/listanime", dbController.list_anime);
router.get("/animedata/:id", dbController.list_single_anime);
router.post("/addRating", dbController.add_rating);

module.exports = router;
