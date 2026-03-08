const mongoose = require("mongoose");
require("dotenv").config();

async function createIndexes() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection("dronejobs").createIndex({ farmer: 1 });
  await db.collection("dronejobs").createIndex({ field: 1 });
  await db.collection("dronejobs").createIndex({ createdAt: -1 });
  await db.collection("aianalyses").createIndex({ inspectionId: 1 });
  await db.collection("droneinspections").createIndex({ farmerId: 1 });

  console.log("✅ Indexes created successfully");
  process.exit(0);
}

createIndexes().catch(console.error);