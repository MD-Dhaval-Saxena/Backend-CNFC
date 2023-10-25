const express = require("express");
const router = express.Router();

const mainController = require("../mainController");

router.post("/getToken/:account", mainController.getTransaction);
router.get("/cancell/listener/:chainid", mainController.stopListening);

module.exports = router;
// 