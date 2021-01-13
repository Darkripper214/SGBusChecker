const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BusStopSchema = new Schema({
  BusStopCode: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  RoadName: {
    type: Schema.Types.String,
    required: true,
  },
  Description: {
    type: Schema.Types.String,
  },
  Latitude: {
    type: Schema.Types.Number,
    required: true,
  },
  Longitude: {
    type: Schema.Types.Number,
    required: true,
  },
  Location: {
    coordinates: { type: Schema.Types.Array },
    type: { type: Schema.Types.String },
  },
});

/* Sample Structure
{
  "BusStopCode": "99119",  
  "RoadName": "Netheravon Rd",
  "Description": "Opp Changi Golf Club",     
  "Latitude": 1.39154974647967,
  "Longitude": 103.98437037471184
  Location: {
    coordinates: [ 103.85253591654006, 1.29684825487647 ],
    type: 'Point'
  }
}
*/

BusStopSchema.index({ Location: "2dsphere" });
module.exports = BusStop = mongoose.model("BusStop", BusStopSchema);
