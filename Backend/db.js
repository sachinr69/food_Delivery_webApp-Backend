const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("MongoDB connected successfully");

    const db = mongoose.connection.db;

    const data = await db.collection("users").find({}).toArray();
    const data1 = await db.collection("foodCategory").find({}).toArray();
    const data2 =  await db.collection("foodData").find({}).toArray();

  //  console.log("foodCategory",data1);
    

  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;