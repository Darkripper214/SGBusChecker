const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const queryString = require("query-string");
const NodeCache = require("node-cache");
const { v4: uuidv4 } = require("uuid");

const API_KEY = process.env.API_KEY;
const url = "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2";

// Instantiate memory cache for External API call
const myCache = new NodeCache();
// Store list of ws subscriber in obj
const wsSub = {};
let cacheMiddleware = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cacheContent = myCache.get(key);
    if (cacheContent) {
      console.log("SENT CACHE!!!!");
      res.send(cacheContent);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        console.log("DID NOT SENT CACHE!!!!");
        myCache.set(key, body, duration);
        res.sendResponse(body);
      };
    }
    next();
  };
};

router.get("/code/:BusStopCode", cacheMiddleware(60), async (req, res) => {
  let { BusStopCode } = req.params;

  try {
    // const result = await fetch(callURI, { headers });
    const result = await getBusArrivalFromLTA(BusStopCode);
    const data = await result.json();

    // Intended for telegram, hence no need to process at telegram side
    data.Services.forEach((service) => {
      service["NextBus"]["EstimatedArrivalTime"] = getArrivalTime(
        service["NextBus"]["EstimatedArrival"]
      );
      service["NextBus2"]["EstimatedArrivalTime"] = getArrivalTime(
        service["NextBus2"]["EstimatedArrival"]
      );
      service["NextBus3"]["EstimatedArrivalTime"] = getArrivalTime(
        service["NextBus3"]["EstimatedArrival"]
      );
    });

    if (data.Services.length <= 0) {
      res.json({});
      return;
    }
    myCache.getStats();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
});

router.ws("/ws/:BusStopCode", (ws, req) => {
  // Create uuid as unique identifier, to be send back to client and used as future reference
  const id = uuidv4();
  wsSub[id] = ws;
  const initialRes = JSON.stringify({
    type: RES_TYPE_CONNECTED,
    uniqueID: id,
  });
  console.log("Connected to:", id);
  ws.send(initialRes, (err) => {
    if (err) {
      console.log(err);
    }
  });

  // Listen to client's request for data
  // To implement caching centrally
  ws.on("message", async (payload) => {
    try {
      let msg = JSON.parse(payload);
      switch (msg["type"]) {
        case REQ_TYPE_CLIENT_REQUEST:
          let data = await getBusArrivalFromLTA(msg["stopCode"]);
          data = await data.json();
          respond = {
            type: RES_TYPE_SERVER_RESPOND,
            data,
          };
          ws.send(JSON.stringify(respond));
          break;
        case REQ_TYPE_CLIENT_PING:
          respond = {
            type: RES_TYPE_SERVER_PING,
          };
          ws.send(JSON.stringify(respond));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

  ws.on("close", () => {
    wsSub[id].close();
    console.log("closing connection");
    delete wsSub[id];
  });
});

// Utility function for getting bus arrival time from LTA API
const getBusArrivalFromLTA = async (BusStopCode) => {
  const callURI = queryString.stringifyUrl({
    url,
    query: {
      BusStopCode,
    },
  });

  const headers = {
    AccountKey: API_KEY,
    Accept: "application/json",
  };

  return await fetch(callURI, { headers });
};

function getArrivalTime(bus) {
  let currentTime = Date.parse(new Date());
  let futureTime = Date.parse(bus);
  return Math.floor((futureTime - currentTime) / 60000) <= 2
    ? "Arriving"
    : `In ${Math.floor((futureTime - currentTime) / 60000)} Minutes`;
}

const RES_TYPE_CONNECTED = "CONNECTED";
const RES_TYPE_SERVER_RESPOND = "RESPOND";
const REQ_TYPE_CLIENT_REQUEST = "REQUEST";
const REQ_TYPE_CLIENT_PING = "CLIENT_PING";
const RES_TYPE_SERVER_PING = "SERVER_PING";

module.exports = router;
