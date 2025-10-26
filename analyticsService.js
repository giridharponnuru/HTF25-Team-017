const Pickup = require("../models/pickup");

exports.getStats = async (req, res) => {
  try {
    const stats = await Pickup.aggregate([
      { $group: { _id: "$wasteType", total: { $sum: 1 } } }
    ]);
    const totalPickups = await Pickup.countDocuments();
    const completed = await Pickup.countDocuments({ status: "completed" });
    const pending = await Pickup.countDocuments({ status: "pending" });

    res.json({ totalPickups, completed, pending, breakdown: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
