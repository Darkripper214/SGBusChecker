const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusServiceSchema = new Schema({
  ServiceNo: { type: Schema.Types.String, required: true },
  Operator: { type: Schema.Types.String, required: true },
  Direction: { type: Schema.Types.Number, required: true },
  StopSequence: { type: Schema.Types.Number, required: true },
  BusStopCode: { type: Schema.Types.String, required: true },
  Distance: { type: Schema.Types.Number },
  WD_FirstBus: { type: Schema.Types.String },
  WD_LastBus: { type: Schema.Types.String },
  SAT_FirstBus: { type: Schema.Types.String },
  SAT_LastBus: { type: Schema.Types.String },
  SUN_FirstBus: { type: Schema.Types.String },
  SUN_LastBus: { type: Schema.Types.String },
});

/* Sample Structure
{
  "ServiceNo": "123",
  "Operator": "SBST",
  "Direction": 1,
  "StopSequence": 16,
  "BusStopCode": "13029",
  "Distance": 6.1,
  "WD_FirstBus": "0603",
  "WD_LastBus": "0003",
  "SAT_FirstBus": "0603",
  "SAT_LastBus": "0003",
  "SUN_FirstBus": "0618",
  "SUN_LastBus": "0002"
}
*/
module.exports = BusService = mongoose.model('BusService', BusServiceSchema);
