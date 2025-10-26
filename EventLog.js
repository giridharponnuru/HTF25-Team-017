const mongoose = require("mongoose");

const eventLogSchema = new mongoose.Schema({
  eventType: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EventLog", eventLogSchema);
