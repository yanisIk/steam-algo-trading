'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Ride = require('./ride');

// Use native promises.
mongoose.Promise = global.Promise;

// Define the Pilot schema.
const ItemStatsSchema = new Schema({
  marketHashName: { type: String, required: true, unique: true },
  imageUrl: String,
  itemType: { type: String, required: true },
  marketPrice: { type: Number, required: true },
  sales: [
    { marketName: String,
      price: Number,
      wearValue: Number,
      soldAt: Date  }
  ],
  avgMarketPrices: [
    { marketName: String,
      price: Number,
      updatedAt: Date  }
  ],
  avgSalePrices: [
    { marketName: String,
      price: Number,
      updatedAt: Date  }
  ]
});

const ItemStat = mongoose.model('ItemStat', ItemStatsSchema);

module.exports = ItemStat;
