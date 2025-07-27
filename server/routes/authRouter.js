const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/register").post(authControllers.register);
router.route("/login").post(authControllers.login);
router.route("/user").get( authMiddleware,authControllers.user);

module.exports = router;