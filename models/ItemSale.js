'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use native promises.
mongoose.Promise = global.Promise;

const ItemSaleSchema = new Schema({
  marketHashName: { type: String, required: true, unique: true },
  itemType: { type: String, required: true },
  marketName: { type: String, required: true, lowercase: true, trim: true },
  price: Number,
  timestamp: Date
});

const ItemSale = mongoose.model('ItemSale', ItemSaleSchema);

module.exports = ItemSale;
