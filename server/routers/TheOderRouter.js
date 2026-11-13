const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");
const TheOderController = require("../controllers/TheOderController");

router.post("/", verifyToken, TheOderController.postoder);
router.get("/", verifyToken, TheOderController.getoder);
router.get("/admintheoder", verifyToken, verifyAdmin, TheOderController.getoderadmin);
router.put("/:id", verifyToken, verifyAdmin, TheOderController.acceptoderadmin);
router.delete("/:id", verifyToken, TheOderController.deleteoder);

module.exports = router;
