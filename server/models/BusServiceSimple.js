const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusServiceSimpleSchema = new Schema({
  ServiceNo: { type: Schema.Types.String, required: true },
  Operator: { type: Schema.Types.String, required: true },
  BusStopCode: { type: Schema.Types.Array, required: true },
});

/* Sample Structure
{
  "ServiceNo": "123",
  "Operator": "SBST",
  "BusStopCode": [75009,12003, ...],
}
*/
module.exports = BusServiceSimple = mongoose.model(
  'BusServiceSimple',
  BusServiceSimpleSchema
);
