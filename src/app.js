require("dotenv").config();
// # Replace this with your Unix timestamp
const express = require("express");
const mainRoute = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const db = require("./db");
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
  console.log(jsonResponse);
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
  for (let i = 0; i < trx.length; i++) {
    let oneTrx = trx[i];
    let data = {
      tokenAmount: oneTrx.tokenAmount,
      account: oneTrx.account,
    };
    getUpdateBal(data);
  }
}
// getUserBal()

//cron
const CronJob = require("cron").CronJob;

const epochTime = getStartTimeData(); //when ico starts
const targetDate = new Date(epochTime * 1000);

const job = new CronJob(
  targetDate,
  () => {
    setInterval(() => {
      console.log("//12:06:39 PM");
    }, 200);
  },
  null,
  true,
  "UTC"
);

app.listen(port, () => {
  console.log(`Server is Running On http://localhost:${port}`);
});
//
