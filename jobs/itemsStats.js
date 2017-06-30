'use strict';
const _ = require('lodash');
const async = require('async');
const jobNames = require('../jobs.json');
const market_hash_names = require('/config/market_hash_names.json');
const AvgMarketPrice = require('../models/AvgMarketPrice.js');
const marketsClient = require('../services/marketsClient.js');

module.exports = function(agenda) {
  
  agenda.define(jobNames.OpskinsAvgMarketPrice, function(job, done) {
   
    //1) Get AVG PRICES from opskins
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
    //Create models then save to db
    .then(filteredAvgPrices => {
        //Create models
        let avgMarketPrices = filteredAvgPrices
        .keys()
        //extract each date
        .map((item_name) => {
          return filteredAvgPrices[item_name].keys().map((date) => {
            return {  marketHashName: item_name,
                      marketName: 'opskins',
                      itemType: 'all',
                      avgPrice: filteredAvgPrices[item_name][date].price,
                      timestamp: new Date(date)
                  }
          });
        });
        avgMarketPrices = _.flatten(avgMarketPrices);
        
        //Save to DB
        return new Promise((resolve, reject) => {
            async.eachLimit(avgMarketPrices, 5, (avgMarketPrice, cb) => {
              AvgMarketPrice.findOneAndUpdate(
                {marketHashName: avgMarketPrice.marketHashName, marketName: avgMarketPrice, timestamp: new Date(date)},
                avgMarketPrice, 
                {upsert: true}
              )
              .then((item) => {
                cb();
              })
              .catch(err => cb(err))

            }, (err) => {
              if (err) return reject(err);
              resolve(avgMarketPrices);
            });
        });
      })
      .then(() => done(null, avgMarketPrices))
      .catch(err => done(err));
  
  });

  agenda.define(jobNames.BitskinsAvgMarketPrice, function(job, done) {

      //Get all stats from opskins
      let bitskinsStatsPromise = marketsClient.getBitskinsMarketDataByItems(market_hash_names);
      //Transform the data before saving to db
      bitskinsStatsPromise.then(stats => {
        
        avgMarketPrices = stats.map(stat => {
          return {
            marketHashName: stat.market_hash_name,
            marketName: 'bitskins',
            itemType: 'all',
            avgPrice: stat.recent_sales_info.average_price,
            timestamp: new Date(stat.updated_at)
          }
        });
        return new Promise((resolve, reject) => {
          //Save to DB
          async.eachLimit(avgMarketPrices, 5, (avgMarketPrice, cb) => {
              
              AvgMarketPrice.findOneAndUpdate(
                {marketHashName: avgMarketPrice.marketHashName, marketName: avgMarketPrice, timestamp: new Date(date)},
                avgMarketPrice, 
                {upsert: true}
              )
              .then((item) => {
                cb();
              })
              .catch(err => cb(err))

          }, (err) => {
            if (err) return reject(err);
            resolve(bitskinsStats);
          });
        });
      })
      .then((bitskinsStats) => done(null, bitskinsStats))
      .catch(err => done(err));
  })
      
  
  agenda.on('ready', function() {
    agenda.every('1 hour', jobNames.BitskinsAvgMarketPrice)
    //Opskins only update their prices every 24h
    agenda.every('2 hours', jobNames.OpskinsAvgMarketPrice);

    //Run them on startup to init db with data
    agenda.now(jobNames.BitskinsAvgMarketPrice);
    agenda.now(jobNames.OpskinsAvgMarketPrice);
  });
}