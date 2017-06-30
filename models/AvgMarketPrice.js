'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use native promises.
mongoose.Promise = global.Promise;

// Define the Pilot schema.
const AvgMarketPriceSchema = new Schema({
  marketHashName: { type: String, required: true, unique: true },
  itemType: { type: String, required: true },
  marketName: { type: String, required: true },
  avgPrice: Number,
  timestamp: Date
});

const AvgMarketPrice = mongoose.model('AvgMarketPrice', AvgMarketPriceSchema);

module.exports = AvgMarketPrice;
