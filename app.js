var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var collections = require('./routes/collections');
var routesForUser = require('./routes/forUser');
var routesForAdmin = require('./routes/forAdmin');
// var routesLeidejai = require('./routes/leidejai');
// var routesDuomenuBazes = require('./routes/duomenuBazes');
// var users = require('./routes/users');

var vv = require('./variables.js');
var ff = require('./routes/functionsforRouting.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
        
// uncomment after placing your favicon in /resourcesStaticForFrontend_aka_public
//app.use(favicon(path.join(__dirname, 'resourcesStaticForFrontend_aka_public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'resourcesStaticForFrontend_aka_public')));

app.use(favicon(__dirname + '/resourcesStaticForFrontend_aka_public/images/favicon.ico'));



app.locals.vv = vv;



app.use(vv.pathAdmin, routesForAdmin);
// app.use('/', function(next) { console.log('keliaujam i routesForUser'); next(routesForUser);});
app.use('/', routesForUser);


app.use('/', function(req, res, next) {
  console.log('@@@@@@@85');
  next(vv.getObjektaError404());
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use('/', function(err, req, res, next) {
    console.log('@@@@@@@93 in app.js: renderinam ir siunciam clientui puslapi su pranesimu apie klaida');
    var objektasKintamujuPerduodamasIJade = ff.getObjektaKintamujuPerduodamaIJade(req, res, next);
    objektasKintamujuPerduodamasIJade.pp.message = err.message;
    objektasKintamujuPerduodamasIJade.pp.error = err;
    res.status(err.status || 500);
    res.render('puslapisError.jade', objektasKintamujuPerduodamasIJade);
  });
}

// production error handler
// no stacktraces leaked to user
app.use('/', function(err, req, res, next) {
  // console.log('@@@@@@@106  in app.js: ');
  var objektasKintamujuPerduodamasIJade = ff.getObjektaKintamujuPerduodamaIJade(req, res, next);
  objektasKintamujuPerduodamasIJade.pp.message = err.message;
  objektasKintamujuPerduodamasIJade.pp.error = err;
  res.status(err.status || 500);
  res.render('puslapisError.jade', objektasKintamujuPerduodamasIJade);
});


module.exports = app;
