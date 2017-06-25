'use strict';
const _ = require('lodash');
const async = require('async');
const jobNames = require('../jobs.json');
const ItemStat = require('../models/ItemStat.js');
const marketsClient = require('../services/marketsClient.js');


module.exports = function(agenda) {
  agenda.define(jobNames.ArbitrageFinder, function(job, done) {
    //get objects on sale from opskins
    let opskinsItemsPromise = marketsClient.getOpskinsSales();
    //get objetcs on sale from bitkins
    let bitskinsItemsPromise = marketsClient.getBitskinsItemsOnSale();
    
    Promise.all([opskinsItemsPromise, bitskinsItemsPromise])
    //create a map of stats for each items from each exchange
    .then((...opskinsItems, bitskinsItems) => {
      return new Promise((resolve, reject) => {        
        
        ////// 1) Transforms items array into map<itemId, cheapestItem>;
        let bitskinsItemsMap = new Map();
        let opskinsItemsMap = new Map();
        
        opskinsItems.forEach(item => {
          let actualItem = opskinsItemsMap.get(item.market_hash_name);
          if (!actualItem) opskinsItemsMap.set(item.market_hash_name, item);
          else {
            if (item.price < actualItem.price) {
              opskinsItemsMap.set(item.market_hash_name, item);
            }
          }
        });

        bitskinsItems.forEach(item => {
          let actualItem = bitskinsItemsMap.get(item.market_hash_name);
          if (!actualItem) bitskinsItemsMap.set(item.market_hash_name, item);
          else {
            if (item.price < actualItem.price) {
              bitskinsItemsMap.set(item.market_hash_name, item);
            }
          }
        });

        //Keep only common items
        bitskinsItemsMap.keys().forEach(key => {
          if (!opskinsItemsMap.has(key)) bitskinsItemsMap.delete(key);
        });
        opskinsItemsMap.keys().forEach(key => {
          if (!bitskinsItemsMap.has(key)) opskinsItemsMap.delete(key);
        });

        const unique_market_hash_names = bitskinsItems.keys();
        //////ENDS 1)


        //////2) Get stats for each item on each exchange;
        let opskinsStatsMap = new Map();
        let bitskinsStatsMap = new Map();
        async.forEachLimit(unique_market_hash_names, 1, (name, cb) => {
          let opskinsStatsPromise; //TODO
          let bitskinsStatsPromise; //TODO
          Promise.all([opskinsStatsPromise, bitskinsStatsPromise])
          .then((...opskinsStats, bitskinsStats) => {
            opskinsStatsMap.set(name, opskinsStats);
            bitskinsStatsMap.set(name, bitskinsStats);
            cb();
          })
          .catch(err => cb(err));
        }, (err) => {
          if (err) return reject(err);
          resolve({
            opskinsItemsMap: opskinsItemsMap, 
            bitskinsItemsMap: bitskinsItemsMap,
            opskinsStatsMap: opskinsStatsMap,
            bitskinsStatsMap: bitskinsStatsMap
          });
        });
      });
    })
    .then((itemsAndStatsMaps) => {
      return new Promise((resolve, reject) => {
        let arbitrageOpportunities = [];
        let unique_market_hash_names = itemsAndStatsMaps.opskinsItems.keys();
        //for each market_hash_name
        async.eachLimit(unique_market_hash_names, 1, (name, cb) => {
          //check if opskins price < bitskins avg price
          let opskinsPrice = itemsAndStatsMaps.opskinsItemsMap.get(name).price;
          let bitskinsPrice = itemsAndStatsMaps.bitskinsItemsMap.get(name).price;
          let opskinsAvgPrice = itemsAndStatsMaps.opskinsStatsMap.get(name).avgPrice;
          let bitskinsAvgPrice = itemsAndStatsMaps.bitskinsStatsMap.get(name).avgPrice;
          
          if (opskinsPrice < bitskinsAvgPrice) {
            //TODO
            //double check with: if sold enough on bitskins
              //save ArbitrageOpportunity {from: opskins, to: bitskins} to db then to array
          }

          if (bitskinsPrice < opskinsAvgPrice) {
            //TODO
            //double check with: if sold enough on opskins
              //save ArbitrageOpportunity {from: bitskins, to: opskins} to db then to array
          }
        }, (err) => {
          if (err) return reject();
          //When done, callback with array 
          done(null, arbitrageOpportunities);
        })
        });
    });
  });

  
  agenda.on('ready', function() {
    agenda.every('1 minute', jobNames.ArbitrageFinder)
  });
}