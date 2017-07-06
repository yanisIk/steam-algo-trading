'use strict';

const express = require('express');
const passport = require('passport');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const sass = require('node-sass-middleware');
const moment = require('moment');
const dotenv = require('dotenv');
//const kue = require('kue');
const basicAuth = require('basic-auth-connect');
const jobManager = require('./jobManager');

if (!process.env.AWS) {
  dotenv.load({ path: '.env' });
}

const app = express();

const APP_VERSION = "1.0.1";
app.locals.cacheBuster = APP_VERSION;

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
if (!process.env.AWS) app.use(logger("dev"));
// Enable sessions using encrypted cookies.
app.use(session({
  secret: process.env.COOKIE_SECRET,
  signed: true
}));
app.use(cookieParser());
if (!process.env.AWS) app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  prefix: "/public",
  debug: process.env.AWS ? false : true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore any existing authentication state.
app.use(passport.initialize());
app.use(passport.session());

// Middleware that exposes the pilot object (if any) to views.
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});
app.locals.moment = moment;

// kue.app.set('title', 'Steam Algo Trader');
// app.use(basicAuth('skini', 'skini123'));
// app.use('/kue', kue.app);


// // CRUD routes for the pilot signup and dashboard.
// app.use('/pilots', require('./routes/pilots/pilots'));
// app.use('/pilots/stripe', require('./routes/pilots/stripe'));

// // API routes for rides and passengers used by the mobile app.
// app.use('/api/settings', require('./routes/api/settings'));
// app.use('/api/rides', require('./routes/api/rides'));
// app.use('/api/passengers', require('./routes/api/passengers'));

// Index page for Rocket Rides.
app.get('/', (req, res) => {
  res.render('index');
});

// Catch 404 errors and forward to error handler.
app.use((req, res, next) => {
  res.status(404).render('404');
});

// Error handlers.

// Development error handler.
// Will print stacktrace.
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler.
// No stacktraces leaked to user.
app.use((err, req, res) => {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Start the server on the correct port.
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Steam Algo Trader listening on port ${server.address().port}`);
});
