const pendingTrx = require("../Model/PendingBalance");
const confirmTrx = require("../Model/Confirmbalance");


let start_url = "http://localhost:3000/getStartTime";

const getStartTimeData = async () => {
  const response = await fetch(start_url);
  const jsonResponse = await response.json();
  return jsonResponse.startTime;
};
let url =
  "http://localhost:3000/getToken/0x0fadb24C9A7ac088c329C4Fa87730D3B2df2f525";

const getData = async () => {
  let startTime = await getStartTimeData();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startTime }),
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
};

let updatBal_url = "http://localhost:3000/updateBalance";

const getUpdateBal = async (_dataToken) => {
  const response = await fetch(`${updatBal_url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_dataToken),
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
};



let getTrxsURL = "http://localhost:3000/getTrxs";
let trx;
isActive_GetUserBal = true;
const getUserBal = async () => {
  if (isActive_GetUserBal == true) {
    console.log("RUnning in getUserBal");
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

      let user = await pendingTrx.find({ account: data.account });

      let update = await pendingTrx.deleteOne({ account: user[0].account });

      console.log("🚀 --------------------------------🚀");
      console.log("🚀 ~ processTrx ~ update:", update);
      console.log("🚀 --------------------------------🚀");

      let cnfrmBalCheck = await confirmTrx.find({
        account: data.account,
      });

      if (cnfrmBalCheck.length === 0) {
        let confrim = new confirmTrx(data);
        let confrimUserBal = await confrim.save();
        console.log("🚀 ------------------------------------------------🚀");
        console.log("🚀 ~ processTrx ~ confrimUserBal:", confrimUserBal);
        console.log("🚀 ------------------------------------------------🚀");
      } else {
        let update = await confirmTrx.findOneAndUpdate(
          { account: data.account },
          {
            tokenAmount: cnfrmBalCheck[0].tokenAmount + data.tokenAmount,
          },
          { new: true }
        );
        console.log("🚀 --------------------------------🚀");
        console.log("🚀 ~ processTrx ~ update:", update);
        console.log("🚀 --------------------------------🚀");
      }
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
};

module.exports = { getStartTimeData, getData ,getUpdateBal,getUserBal};
