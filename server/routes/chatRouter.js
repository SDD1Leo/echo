const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const chatControllers = require("../controllers/chatControllers")

router.route("/").post(authMiddleware,chatControllers.accessChat);
router.route("/").get(authMiddleware,chatControllers.fetchChats);
router.route("/group").post(authMiddleware,chatControllers.createGroupChat);
router.route("/rename").put(authMiddleware,chatControllers.renameGroup);
router.route("/groupadd").put(authMiddleware,chatControllers.addToGroup);
router.route("/groupremove").put(authMiddleware,chatControllers.removeFromGroup);


module.exports = router;