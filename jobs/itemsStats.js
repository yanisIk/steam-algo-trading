'use strict';
const _ = require('lodash');
const async = require('async');
const jobNames = require('../jobs.json');
const ItemStat = require('../models/ItemStat.js');
const marketsClient = require('../services/marketsClient.js');

module.exports = function(agenda) {
  agenda.define(jobNames.OpskinsItemStats, function(job, done) {
    //TODO
    //Get market_hash_names to track
    let market_hash_namesPromise;
    
    market_hash_namesPromise
    .then(market_hash_names => {
      //Get all stats from opskins
      let opskinsAvgPricesPromise = marketsClient.getAllOpskinsAvgPrices();
      opskinsAvgPricesPromise
      //filter only tracked items
      .then(allAvgPrices => {
        let filteredAvgPrices = {};
        market_hash_names.forEach(name => {
          filteredAvgPrices[name] = allAvgPrices[name];
        });
        return Promise.resolve(filteredAvgPrices);
      })
      //save to DB
      .then(filteredAvgPrices => {
        async.eachLimit(filteredAvgPrices.keys(), 5, (item_name, cb) => {
          //TODO
          //save to db
        }, (err) => {
          if (err) return reject(err);
          resolve(filteredAvgPrices);
        });
      })
      .then((filteredAvgPrices) => done(null, filteredAvgPrices))
      .catch(err => done(err));
    });
  });

  agenda.define(jobNames.BitskinsItemStats, function(job, done) {
    //TODO
    //Get market_hash_names to track
    let market_hash_namesPromise;
    
    market_hash_namesPromise
    .then(market_hash_names => {
      return new Promise((resolve, reject) => {
        //Get all stats from opskins
        let bitskinsStats = marketsClient.getBitskinsMarketDataByItems(market_hash_names);
        async.eachLimit(bitskinsStats, 5, (item, cb) => {
          //TODO
          //save to db
        }, (err) => {
          if (err) return reject(err);
          resolve(bitskinsStats);
        });
      })
    })
    .then((bitskinsStats) => done(null, bitskinsStats))
    .catch(err => done(err));
  });
 
  agenda.on('ready', function() {
    agenda.every('10 minutes', jobNames.BitskinsItemStats)
    agenda.every('10 minutes', jobNames.OpskinsItemStats);
  });
}