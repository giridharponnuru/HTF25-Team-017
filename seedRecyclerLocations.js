const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

async function updateRecyclerLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const recyclers = await User.find({
      role: { $in: ["recycler", "ngo"] },
    });

    if (recyclers.length === 0) {
      console.log("⚠️ No recyclers or NGOs found");
      process.exit();
    }

    // Assign random nearby coordinates for demo
    for (const recycler of recyclers) {
      const baseLon = 78.386;
      const baseLat = 17.444;
      const randomLon = baseLon + (Math.random() - 0.5) * 0.02; // ±0.01 range
      const randomLat = baseLat + (Math.random() - 0.5) * 0.02;

      recycler.location = {
        type: "Point",
        coordinates: [randomLon, randomLat],
      };

      await recycler.save();
      console.log(`📍 Updated ${recycler.name} → ${recycler.location.coordinates}`);
    }

    console.log("✅ All recycler/NGO locations updated!");
    process.exit();
  } catch (err) {
    console.error("❌ Error updating locations:", err.message);
    process.exit(1);
  }
}

updateRecyclerLocations();
