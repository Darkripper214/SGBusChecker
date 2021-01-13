const mongoose = require("mongoose");
db = process.env.DB_URI;

const connectMongo = async () => {
  await mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log("MongoDB Connected...");
  return true;
};

module.exports = connectMongo;
