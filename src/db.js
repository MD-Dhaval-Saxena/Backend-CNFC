require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    mongoose.connect(process.env.mongo_url);
    console.log("Connected to Mongo");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { connectToMongo };

// await mongoose
//     // .connect(process.env.mongo_atlas_url, {
//     //   useNewUrlParser: true,
//     //   // useCreateIndex: true,
//     //   useUnifiedTopology: true,
//     //   // useFindAndModify: false,
//     // })
//     // .catch((err) => console.log(err));

// const connectToMongo=async()=>{
//     await mongoose.connect(DB, {
//       useNewUrlParser: true,
//       // useCreateIndex: true,
//       useUnifiedTopology: true,
//       // useFindAndModify: false,
//     })
//     .catch((err) => console.log(err));
// }

