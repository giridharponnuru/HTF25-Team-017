const EventEmitter = require("events");
const eventBus = new EventEmitter();

eventBus.on("pickupCreated", (pickup) => {
  console.log(`📢 New pickup request created in ${pickup.area}`);
});

eventBus.on("pickupCompleted", (pickup) => {
  console.log(`✅ Pickup ${pickup._id} completed successfully!`);
});

module.exports = eventBus;
