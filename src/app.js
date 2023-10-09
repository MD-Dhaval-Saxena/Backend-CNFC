require("dotenv").config();
// # Replace this with your Unix timestamp
const express = require("express");
const mainRoute = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const db = require("./db");
let UserSchema = require("./Model/User_balance");

db();

const app = express();
const port = process.env.port || 2000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes imported
app.use(mainRoute);

let url =
  "http://localhost:3000/getToken/0x0fadb24C9A7ac088c329C4Fa87730D3B2df2f525";

async function getData() {
  const response = await fetch(url);
  const jsonResponse = await response.json();
  console.log(jsonResponse);
}

getData();

let start_url = "http://localhost:3000/getStartTime";

async function getStartTimeData() {
  const response = await fetch(start_url);
  const jsonResponse = await response.json();
  return jsonResponse.startTime;
}

let dataToken = {
  account: "0x4491e4AC6C15142093FD69bA354839b880BC4794",
  tokenAmount: 4000000,
};

let updatBal_url = "http://localhost:3000/updateBalance";
async function getUpdateBal(_dataToken) {
  const response = await fetch(`${updatBal_url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_dataToken),
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
}

let getTrxsURL = "http://localhost:3000/getTrxs";

let trx;

async function getUserBal() {
  const response = await fetch(getTrxsURL);
  const jsonResponse = await response.json();
  trx = jsonResponse;

  async function processTrx(index) {
    if (index >= trx.length) {
      // All transactions processed
      return;
    }

    const oneTrx = trx[index];
    const data = {
      tokenAmount: oneTrx.tokenAmount,
      account: oneTrx.account,
    };
    console.log(data);


    let user = await UserSchema.find({ account: data.account });

    let update = await UserSchema.findOneAndUpdate(
      { account: user[0].account },
      { tokenAmount: user[0].tokenAmount - data.tokenAmount },
      { new: true }
    );
    console.log(update);

        // Call getUpdateBal after a 5-second delay
        getUpdateBal(data);

    // Process the next transaction after the delay
    setTimeout(() => {
      processTrx(index + 1);
    }, 5000); // 5000 milliseconds (5 seconds)
  }

  // Start processing transactions
  processTrx(0);
}

getUserBal()

//cron

const cron_Job = async () => {
  const CronJob = require("cron").CronJob;

  const epochTime = await getStartTimeData(); //when ico starts
  console.log("🚀 -------------------------🚀");
  console.log("🚀 ~ epochTime:", epochTime);
  console.log("🚀 -------------------------🚀");
  const targetDate = new Date(epochTime * 1000);

  const job = new CronJob(
    targetDate,
    () => {
      console.log("ico Started");
      getUserBal();
    },
    null,
    true,
    "UTC"
  );
};
// cron_Job();

app.listen(port, () => {
  console.log(`Server is Running On http://localhost:${port}`);
});
//
