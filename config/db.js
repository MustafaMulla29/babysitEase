const mongoose = require("mongoose");

//database connection function
const connnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDB server error ${error}`);
  }
};

module.exports = connnectDB;
