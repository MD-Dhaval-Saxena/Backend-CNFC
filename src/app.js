require("dotenv").config();
const express = require("express");
const mainRoute = require("../src/Routes");
const cors = require("cors");
const { connectToMongo } = require("./db");
const { send_usdt } = require("./repository/Token");
const { getData, getUser_pendingTrx } = require("./Database/index");
const { getStartTime } = require("./repository/Token");

connectToMongo();

const app = express();
const port = process.env.port || 2000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes imported
app.use(mainRoute);

// send_usdt("0x0fadb24C9A7ac088c329C4Fa87730D3B2df2f525", 1);

getData();
getUser_pendingTrx();

const cron_Job = async () => {
  const CronJob = require("cron").CronJob;
  const epochTime = await getStartTime(); //when ico starts
  console.log("🚀 -------------------------🚀");
  console.log("🚀 ~ epochTime:", epochTime);
  console.log("🚀 -------------------------🚀");
  const targetDate = new Date(epochTime * 1000);

  const job = new CronJob(
    targetDate,
    () => {
      getUser_pendingTrx();
    },
    null,
    true,
    "UTC"
  );
  job.start();
};
// cron_Job();

app.listen(port, () => {
  console.log(`Server is Running On http://localhost:${port}`);
});
