const express = require("express");
const router = express.Router();
const { createPickup, getUserPickups, updatePickup} = require("../controllers/pickupController");


router.post("/", createPickup);
router.get("/:userId", getUserPickups);
router.put("/:id", updatePickup);

module.exports = router;
