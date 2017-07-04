var Agenda = require('agenda');
var mongoose = require('mongoose');

var agenda;
var jobs = process.env.JOBS ? process.env.JOBS.split(',') : [];

mongoose.connection.once('open', () => {
  var jobs = mongoose.connection.collection('agendaJobs');
  jobs.ensureIndex({
      nextRunAt: 1, 
      lockedAt: 1, 
      name: 1, 
      priority: 1
  }, function() {});
  
  agenda = new Agenda({mongo: jobs});

  jobs.forEach(function(job) {
    require('./jobs/' + job)(agenda);
  })

  if(jobs.length) {
    agenda.start();
  }

})

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

module.exports = agenda;