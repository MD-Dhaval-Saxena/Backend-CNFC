require("dotenv").config();
const express = require("express");
const mainRoute = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const db = require("./db");
const pendingTrx = require("./Model/PendingBalance");
const confirmTrx = require("./Model/Confirmbalance");
const { send_usdt } = require("./repository/Token");
const {
  getStartTimeData,
  getData,
  getUser_pendingTrx,
} = require("./Database/index");
db();

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
  // const epochTime = await getStartTimeData(); //when ico starts
  const epochTime = 1697009984; //when ico starts
  console.log("🚀 -------------------------🚀");
  console.log("🚀 ~ epochTime:", epochTime);
  console.log("🚀 -------------------------🚀");
  const targetDate = new Date(epochTime * 1000);

  const job = new CronJob(
    targetDate,
    () => {
      let result=getUser_pendingTrx();
      if(result==true){
        job.stop()
      }
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
