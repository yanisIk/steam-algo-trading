'use strict';

const jobNames = require('../jobs.json');
const ItemStat = require('../models/ItemStat.js');


module.exports = function(agenda) {
  agenda.define(jobNames.ArbitrageFinder, function(job, done) {
    //get objects on sale from opskins
    //get objetcs on sale from bitkins
    //get opskins market stats for the objects
    //get bitskins market stats for the objects
    
    //for each market_hash_name
    //check if opskins price < bitskins avg price
        //if yes, buy it, save ArbitrageOpportunity to db then to array
    //check if bitskins price < opskins avg price
        //if yes, buy it, save ArbitrageOpportunity to db then to array
    
    //When done, callback with array 

  });

  agenda.define('reset password', function(job, done) {
    
  });

  agenda.on('ready', function() {
    agenda.every('30 minutes', jobNames.ItemStats)
  });
}