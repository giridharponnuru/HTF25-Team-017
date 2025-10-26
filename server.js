const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");
const http = require("http");
const { Server } = require("socket.io");



// Models
const Pickup = require("./models/pickup");
const EventLog = require("./models/EventLog");

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Import Routes
const userRoutes = require("./routes/userRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/admin", adminRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("Inorganic Waste & Scrap Management Backend Running 🚀");
});

// Attach socket instance to app (so controllers can use it)
app.set("socketio", io);

// 🔌 Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// 🕓 Cron Job for Expired Pickups
cron.schedule("0 9 * * *", async () => {
  const overdue = await Pickup.updateMany(
    { status: "pending", date: { $lt: new Date() } },
    { status: "expired" }
  );

  if (overdue.modifiedCount > 0) {
    await EventLog.create({
      eventType: "Auto Expiry",
      message: `${overdue.modifiedCount} pickups expired automatically`,
    });

    // 🔔 Emit real-time event
    io.emit("event_log", {
      eventType: "Auto Expiry",
      message: `${overdue.modifiedCount} pickups expired automatically`,
      timestamp: new Date(),
    });
  }

  console.log(`🕓 Daily check done - ${overdue.modifiedCount} pickups expired`);
});

// Start the Server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
