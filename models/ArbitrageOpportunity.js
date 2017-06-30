'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use native promises.
mongoose.Promise = global.Promise;

// Define the Ride schema.
const ArbitrageOpportunitySchema = new Schema({
  marketHashName: { type: String, required: true },
  itemMarketId: { type: String, required: true, unique: true },
  wearValue: { type: Number },
  price: { type: Number, required: true },
  fromMarketName: { type: String, required: true },
  toMarketName: { type: String, required: true },
  fromMarkeAvgtPrice: { type: Number, required: true },
  toMarketAvgPrice: { type: Number, required: true },
  status: { type: Number, required: true },
  isInUse: { type: Boolean, required: true },
  error: { type: String },
  boughtAt: { type: Date },
  boughtFor: { type: Number },
  soldAt: { type: Date },
  soldFor: { type: Number },
});

// Return the ride amount for the pilot after collecting 20% platform fees.
ArbitrageOpportunitySchema.methods.amountForPilot = function() {
  return parseInt(this.amount * 0.8);
};

const ArbitrageOpportunity = mongoose.model('ArbitrageOpportunity', ArbitrageOpportunity);

module.exports = ArbitrageOpportunity;
