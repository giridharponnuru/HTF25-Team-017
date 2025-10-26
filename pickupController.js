const Pickup = require("../models/pickup");
const User = require("../models/User");
const EventLog = require("../models/EventLog");

// ---------------------- CREATE NEW PICKUP ----------------------
exports.createPickup = async (req, res) => {
  try {
    const { userId, wasteType, address, area, date, donation, location } = req.body;

    // Create new pickup request
    const pickup = new Pickup({
      userId,
      wasteType,
      address,
      area,
      date,
      donation,
      status: "pending",
      location,
    });

    // ♻️ Find a recycler or NGO in the same area
    console.log("Searching for recycler/NGO in area:", area);
    const recycler = await User.findOne({
      area: area,
      $or: [{ role: "recycler" }, { role: "ngo" }],
    });

    if (recycler) {
      pickup.recyclerId = recycler._id;
      console.log(`♻️ Assigned to ${recycler.role}: ${recycler.name} in ${area}`);

      // 📏 Calculate distance if both locations exist
      if (location && recycler.location && recycler.location.coordinates) {
        const [lon1, lat1] = location.coordinates;
        const [lon2, lat2] = recycler.location.coordinates;

        // 🌍 Haversine Formula to calculate distance in km
        const R = 6371; // Radius of Earth (km)
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        pickup.distance = parseFloat(distance.toFixed(2));
        console.log(`📏 Distance between user and recycler: ${pickup.distance} km`);
      } else {
        console.log("⚠️ Missing location data for distance calculation");
      }
    } else {
      console.log(`⚠️ No recycler/NGO available in ${area}`);
    }

    await pickup.save();
    console.log(`📦 New pickup request created in ${area}`);

    // 📝 Log event
    await EventLog.create({
      eventType: "Pickup Created",
      message: `New pickup created in ${area} by user ${userId}`,
    });
    console.log("📝 Event logged: Pickup Created");

    // 🔔 Emit real-time event
    const io = req.app.get("socketio");
    io.emit("event_log", {
      eventType: "Pickup Created",
      message: `New pickup created in ${area} by user ${userId}`,
      timestamp: new Date(),
    });

    res.status(201).json({
      message: "Pickup created successfully",
      distance: pickup.distance,
      pickup,
    });
  } catch (err) {
    console.error("⚠️ Error creating pickup:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- GET USER PICKUPS ----------------------
exports.getUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ userId: req.params.userId });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- UPDATE PICKUP STATUS ----------------------
exports.updatePickup = async (req, res) => {
  try {
    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!pickup) {
      console.log("❌ Pickup not found");
      return res.status(404).json({ message: "Pickup not found" });
    }

    // 🏅 Reward user when status becomes completed
    if (req.body.status === "completed") {
      const user = await User.findById(pickup.userId);
      if (user) {
        user.points = (user.points || 0) + 10;
        await user.save();
        console.log(`🏅 ${user.name} earned 10 points! Total: ${user.points}`);

        // 📝 Log event
        await EventLog.create({
          eventType: "Pickup Completed",
          message: `Pickup ${pickup._id} by ${user.name} in ${pickup.area} marked as completed`,
        });
        console.log("📝 Event logged: Pickup Completed");

        // 🔔 Emit real-time event
        const io = req.app.get("socketio");
        io.emit("event_log", {
          eventType: "Pickup Completed",
          message: `Pickup ${pickup._id} by ${user.name} in ${pickup.area} marked as completed`,
          timestamp: new Date(),
        });
      }
    }

    console.log(`✅ Pickup ${pickup._id} updated to status: ${pickup.status}`);
    res.status(200).json(pickup);
  } catch (err) {
    console.error("⚠️ Error updating pickup:", err.message);
    res.status(500).json({ error: err.message });
  }
};
