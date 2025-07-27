const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");
const authMiddleware = require("../middlewares/authMiddleware"); 

router.route("/").post(authMiddleware,messageControllers.sendMessage);
router.route("/:chatId").get(authMiddleware,messageControllers.allMessages);


module.exports = router;

