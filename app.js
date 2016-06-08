var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var collections = require('./routes/collections');
// var routesLeidejai = require('./routes/leidejai');
// var routesDuomenuBazes = require('./routes/duomenuBazes');
// var users = require('./routes/users');

var variables = require('./variables.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
        
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(__dirname + '/public/images/favicon.ico'));



app.locals.vv = variables;



// app.use(variables.pathLoginFailed, routesZurnaluIrLeidejuIrDuomenuBaziu);
// app.use(variables.pathLogin, routesZurnaluIrLeidejuIrDuomenuBaziu);
// app.use(variables.pathAdmin, routesZurnaluIrLeidejuIrDuomenuBaziu);
app.use('/', collections);
// app.use('/', function(req, res, next) {
//   console.log('@@@@@@@61');
//   next(routesZurnaluIrLeidejuIrDuomenuBaziu);
//   // app.use('/', routesZurnaluIrLeidejuIrDuomenuBaziu);
// });


// app.use(variables.pathIndex, function(req, res, next) {
//   console.log('@@@@@@@82');
//   // next(variables.getObjektaError404());
// });

//
// app.use(variables.pathZurnalai, function(req, res, next) {
//   console.log('@@@@@@@72');
//   next(variables.getObjektaError404());
// });
//

// app.use('/', function(req, res, next) {
//   console.log('@@@@@@@80', req.path);
//   if (req.path == '/') {
//     console.log('@@@@@@@82');
//     res.redirect('/a');
//     console.log('@@@@@@@84');
//   }
//   if (req.path == '/a') {
//     console.log('@@@@@@@87');
//     res.send('cia puslapis is patho /a');
//     res.send('cia puslapis is patho /a wwwww');
//     console.log('@@@@@@@89');
//   }
//   console.log('@@@@@@@91');
//   console.log('@@@@@@@92 neradom ', req.path, 'todel next(variables.getObjektaError404());');
//   // next(variables.getObjektaError404());
// });

app.use('/', function(req, res, next) {
  console.log('@@@@@@@85');
  next(variables.getObjektaError404());
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use('/', function(err, req, res, next) {
    console.log('@@@@@@@93 in app.js: renderinam ir siunciam clientui puslapi su pranesimu apie klaida');
    var objektasKintamujuPerduodamasIJade = collections.getObjektaKintamujuPerduodamaIJade(req, res, next);
    objektasKintamujuPerduodamasIJade.pp.message = err.message;
    objektasKintamujuPerduodamasIJade.pp.error = err;
    res.status(err.status || 500);
    res.render('puslapisError.jade', objektasKintamujuPerduodamasIJade);
    // res.render('puslapisError.jade', {
    //   // pavadinimasSvetaines: variables.pavadinimasSvetaines,
    //   message: err.message,
    //   error: err
    // });
  });
}

// production error handler
// no stacktraces leaked to user
app.use('/', function(err, req, res, next) {
  // console.log('@@@@@@@106  in app.js: ');
  var objektasKintamujuPerduodamasIJade = collections.getObjektaKintamujuPerduodamaIJade(req, res, next);
  objektasKintamujuPerduodamasIJade.pp.message = err.message;
  objektasKintamujuPerduodamasIJade.pp.error = err;
  res.status(err.status || 500);
  res.render('puslapisError.jade', objektasKintamujuPerduodamasIJade);
  // res.render('puslapisError.jade', {
  //   // pavadinimasSvetaines: variables.pavadinimasSvetaines,
  //   message: err.message,
  //   error: {}
  // });
});


module.exports = app;
