const express = require('express');
const router = express.Router();
const BusService = require('../../models/BusService');
const BusServiceSimple = require('../../models/BusServiceSimple');

const selectItemAll = 'ServiceNo Operator Direction BusStopCode -_id';
const selectItemSimple = 'ServiceNo Operator BusStopCode -_id';

// Return master list of all bus services
router.get('/special/all', async (req, res) => {
  let result = await BusService.findOne({}).select(selectItemAll);

  res.json(result);
});

// Return master list of all bus services
router.get('/code/:busId', async (req, res) => {
  let busId = req.params.busId;
  let result = await BusServiceSimple.findOne({
    ServiceNo: `${busId}`,
  }).select(selectItemSimple);

  if (!result) {
    res.json({});
    return;
  }
  res.json(result);
});

module.exports = router;
