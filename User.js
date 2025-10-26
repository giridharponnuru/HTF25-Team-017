const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "recycler", "admin", "ngo"], default: "user" },
  area: String,
  points: { type: Number, default: 0 },

  // 🌍 Location for recyclers, NGOs, and users
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
