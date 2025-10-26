const express = require("express");
const router = express.Router();
const Pickup = require("../models/pickup");

// 📊 GET: Admin Stats
const EventLog = require("../models/EventLog");

// 🧾 GET: All event logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await EventLog.find().sort({ timestamp: -1 });
    res.json(logs);
    console.log("🧾 Admin fetched event logs");
  } catch (err) {
    console.error("⚠️ Error fetching logs:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalPickups = await Pickup.countDocuments();
    const completed = await Pickup.countDocuments({ status: "completed" });
    const pending = await Pickup.countDocuments({ status: "pending" });
    const donations = await Pickup.countDocuments({ donation: true });

    // Group by waste type
    const breakdown = await Pickup.aggregate([
      { $group: { _id: "$wasteType", total: { $sum: 1 } } },
    ]);

    res.json({
      totalPickups,
      completed,
      pending,
      donations,
      breakdown,
    });

    console.log("📊 Admin analytics fetched successfully!");
  } catch (err) {
    console.error("⚠️ Error fetching admin stats:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
