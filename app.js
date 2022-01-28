const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite', // version of SQL you're using
    storage: 'library.db', // specify the file path or the storage engine for SQLite
    logging: true // disable logging
});

(async()=> {
  await sequelize.authenticate();
  console.log('Connection to the database successful!');

  await sequelize.sync({ force: true }); //synch all models at once instead of one at a time

    // NOTE : ^sync() issues a CREATE TABLE IF NOT EXISTS

    // {force: true}, refresh your database tables each time you start your app

    // Calling sync({ force: true }) issues a DROP TABLE IF EXISTS statement, which completely deletes the table, before issuing the CREATE TABLE IF NOT EXISTS statement. In other words, it will drop a table that exists, each time you start your app, and recreate it from the model definition.
})();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  var err = new Error();
  err.status = 404;
  err.message = "Oops!  It looks like the page you're looking for does not exist.";
  res.status(404).render("page-not-found", { err })
    next(err)
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render("page-not-found", { err });
    } else {
        err.message = "Sorry! There was an unexpected error on the server."
        res.status(err.status || 500).render("error", { err })
    }
    console.log(err.message);
});

module.exports = app;
