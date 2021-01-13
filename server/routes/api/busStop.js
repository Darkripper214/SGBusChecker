const express = require('express');
const router = express.Router();
const BusStop = require('../../models/BusStop');

// String for selecting parameter without MongoDB _id field
const selectItem = 'BusStopCode RoadName Description Latitude Longitude -_id';

router.get('/code/:id', async (req, res) => {
  let id = req.params.id;

  let result = await BusStop.findOne({
    BusStopCode: `${id}`,
  }).select(selectItem);

  if (!result) {
    res.json({});
    return;
  }
  res.json(result);
});

router.get('/desc/:name', async (req, res) => {
  let name = req.params.name;

  // find similar name
  let result = await BusStop.find({
    Description: { $regex: name, $options: 'i' },
  }).select(selectItem);

  if (!result) {
    res.json({});
    return;
  }
  res.json(result);
});

router.get('/location/', async (req, res) => {
  let longitude = parseFloat(req.query.longitude);
  let latitude = parseFloat(req.query.latitude);

  if (!longitude || !latitude) {
    res.json({});
    return;
  }
  try {
    let result = await BusStop.find({
      Location: {
        $near: {
          $maxDistance: 200,
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        },
      },
    }).select(selectItem);

    if (!result) {
      res.json({});
      return;
    }
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json({});
  }
  // find similar name
});

module.exports = router;
