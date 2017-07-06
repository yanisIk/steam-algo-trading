'use strict';
const _ = require('lodash');
const async = require('async');
const market_hash_names = require('../config/market_hash_names.json');
const ArbitrageOpportunity = require('../models/ArbitrageOpportunity');
const AvgMarketPrice = require('../models/AvgMarketPrice');
const marketsClient = require('../services/marketsClient');

const jobNamesArray = process.env.JOBS ? process.env.JOBS.split(',') : [];
const jobNames = {};
jobNamesArray.forEach(job => jobNames[job] = job);

module.exports = function(queue) {

  queue.process(jobNames.ArbitrageFinder, function(job, done) {
    
    console.log('Starting JOB:', jobNames.ArbitrageFinder);

    //get objects on sale from opskins
    let opskinsItemsPromise = marketsClient.getOpskinsSales(market_hash_names);
    //get objetcs on sale from bitkins
    let bitskinsItemsPromise = marketsClient.getBitskinsItemsOnSale(market_hash_names);
    
    Promise.all(...[opskinsItemsPromise, bitskinsItemsPromise])
    //create a map of stats for each items from each exchange
    .then((opskinsItems, bitskinsItems) => {
      return new Promise((resolve, reject) => {        
        
        ////// 1) Transforms items array into map<itemId, cheapestItem>;
        let bitskinsItemsMap = new Map();
        let opskinsItemsMap = new Map();
        
        opskinsItems.forEach(item => {
          let actualItem = opskinsItemsMap.get(item.market_name);
          if (!actualItem) opskinsItemsMap.set(item.market_name, item);
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
        //////ENDS 1)


        //////2) Get stats for each item on each exchange;
        let opskinsAvgPricesMap = new Map();
        let bitskinAvgPricesMap = new Map();
        async.forEachLimit(unique_market_hash_names, 1, (name, cb) => {
          let opskinsAvgPricesPromise = AvgMarketPrice.findOne({marketHashName: name, marketName: 'opskins'});
          let bitskinsAvgPricesPromise = AvgMarketPrice.findOne({marketHashName: name, marketName: 'bitskins'});
          Promise.all(...[opskinsAvgPricesPromise, bitskinsAvgPricesPromise])
          .then((opskinsStats, bitskinsStats) => {
            opskinsAvgPricesMap.set(name, opskinsStats);
            bitskinAvgPricesMap.set(name, bitskinsStats);
            cb();
          })
          .catch(err => cb(err));
        }, (err) => {
          if (err) return reject(err);
          resolve({
            opskinsItemsMap: opskinsItemsMap, 
            bitskinsItemsMap: bitskinsItemsMap,
            opskinsAvgPricesMap: opskinsAvgPricesMap,
            bitskinAvgPricesMap: bitskinAvgPricesMap
          });
        });
      });
    })
    .then((itemsAndStatsMaps) => {
      return new Promise((resolve, reject) => {
        
        let arbitrageOpportunities = [];

        //for each market_hash_name
        async.eachLimit(market_hash_names, 1, (name, cb) => {
          //check if opskins price < bitskins avg price
          let opskinsPrice = itemsAndStatsMaps.opskinsItemsMap.get(name).amount;
          let bitskinsPrice = itemsAndStatsMaps.bitskinsItemsMap.get(name).price;
          let opskinsAvgPrice = itemsAndStatsMaps.opskinsAvgPricesMap.get(name)[0].avgPrice;
          let bitskinsAvgPrice = itemsAndStatsMaps.bitskinsAvgPricesMap.get(name)[0].avgPrice;

          if (opskinsPrice < bitskinsAvgPrice) {
            //TODO
            //double check with: if sold enough on opskins ( > 10 last week )
              //save ArbitrageOpportunity {from: opskins, to: bitskins} to db then to array
              let arbitrageOpportunity = {
                marketHashName: name,
                itemMarketId: itemsAndStatsMaps.opskinsItemsMap.get(name).id,
                wearValue: itemsAndStatsMaps.opskinsItemsMap.get(name).wear,
                price: opskinsPrice,
                fromMarketName: 'opskins',
                toMarketName: 'bitskins',
                fromMarketAvgPrice: opskinsAvgPrice,
                toMarketAvgPrice: bitskinsAvgPrice,
                potentialPlusValue: bitskinsAvgPrice - opskinsPrice,
                status: 0,
                isInUse: false
              };
              arbitrageOpportunities
              .push(arbitrageOpportunity);
          }

          if (bitskinsPrice < opskinsAvgPrice) {
            //TODO
            //double check with: if sold enough on bitskins ( > 10 last week )
              //save ArbitrageOpportunity {from: bitskins, to: opskins} to db then to array
              let arbitrageOpportunity = {
                marketHashName: name,
                itemMarketId: itemsAndStatsMaps.bitskinsItemsMap.get(name).item_id,
                wearValue: -1,
                price: bitskinsPrice,
                fromMarketName: 'bitskins',
                toMarketName: 'opskins',
                fromMarketAvgPrice: bitskinsAvgPrice,
                toMarketAvgPrice: opskinsAvgPrice,
                potentialPlusValue: opskinsAvgPrice - bitskinsPrice,
                status: 0,
                isInUse: false
              };
              arbitrageOpportunities
              .push(arbitrageOpportunity);
          }

          cb();


        }, (err) => {
          if (err) return reject(err);
          //When done, callback with array 
          resolve(arbitrageOpportunities);
        })
      });
    })
    .then((arbitrageOpportunities) => {
        return new Promise((resolve, reject) => {
          async.eachLimit(arbitrageOpportunities, 5, (arbitrageOpportunity, cb) => {
            
            //save to db
            ArbitrageOpportunity.findOneAndUpdate(
              {itemMarketId: arbitrageOpportunity.itemMarketId, isInUse: false, status: 0},
              arbitrageOpportunity,
              {upsert: true}
            )
            .then(() => cb())
            .catch(err => cb(err));

          }, (err) => {
            if (err) return reject(err);
            resolve(arbitrageOpportunities);
          });
        });
    })
    .then((arbitrageOpportunities) => done(null, arbitrageOpportunities))
    .catch(err => done(err));
  });


  queue.on('ready', function() {
    queue.every('2 minutes', jobNames.ArbitrageFinder)
  });
}