const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recyclerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  wasteType: String,
  address: String,
  area: String,
  date: Date,
  donation: Boolean,
  status: { type: String, default: "pending" },

  // 🌍 Add location field for user's chosen point
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },

  distance: Number, // optional — if you calculate later
});

pickupSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Pickup", pickupSchema);
