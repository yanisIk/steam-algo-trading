'use strict';

const jobNames = require('../jobs.json');
const ItemStat = require('../models/ItemStat.js');


module.exports = function(agenda) {
  agenda.define(jobNames.ItemStats, function(job, done) {
    
  });

  agenda.define('reset password', function(job, done) {
    
  });

  agenda.on('ready', function() {
    agenda.every('30 minutes', jobNames.ItemStats)
  });
}