
var kue = require('kue')
var queue = kue.createQueue({redis: process.env.REDIS_URI});

var jobs = process.env.JOBS ? process.env.JOBS.split(',') : [];

jobs.forEach(function(job) {
  require('./jobs/' + job)(queue);
})

if(jobs.length) {
  agenda.start();
}

queue.watchStuckJobs(5000);

process.once( 'SIGTERM', function ( sig ) {
  queue.shutdown( 5000, function(err) {
    console.log( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

module.exports = kue;