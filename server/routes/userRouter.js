const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware")

router.route("/").get(authMiddleware,userControllers.search);


module.exports = router;