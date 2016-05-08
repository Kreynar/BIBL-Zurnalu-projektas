var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routesZurnaluIrLeidejuIrDuomenuBaziu = require('./routes/collections');
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


app.locals.pavadinimasSvetaines = variables.pavadinimasSvetaines;
app.locals.pristatymasSvetaines = variables.pristatymasSvetaines;
app.locals.getPavadinimaStulpelio = variables.getPavadinimaStulpelio;
app.locals.getPavadinimaFieldo = variables.getPavadinimaFieldo;
app.locals.getArRodomasStulpelisLenteleje = variables.getArRodomasStulpelisLenteleje;
app.locals.getArFiksuojamasFieldasDuomenuBazeje = variables.getArFiksuojamasFieldasDuomenuBazeje;
app.locals.getAliasArbaNumeriStulpelioArbaFieldo = variables.getAliasArbaNumeriStulpelioArbaFieldo;
app.locals.kiekisStulpeliuArbaFieldu = variables.kiekisStulpeliuArbaFieldu;
app.locals.masyvasRaidziuAbecelesLietuviskos = variables.masyvasRaidziuAbecelesLietuviskos;
app.locals.pathIndex = variables.pathIndex;
app.locals.pathZurnalai = variables.pathZurnalai;
app.locals.pathZurnalasNaujas = variables.pathZurnalasNaujas;
app.locals.pathZurnalasAnksciauSukurtas = variables.pathZurnalasAnksciauSukurtas;
app.locals.parametrasQueryPaieskuPagalRaide = variables.parametrasQueryPaieskuPagalRaide;
app.locals.parametrasQueryPaieskuPagalFraze = variables.parametrasQueryPaieskuPagalFraze;
app.locals.pathLeidejai = variables.pathLeidejai;
app.locals.pathLeidejasNaujas = variables.pathLeidejasNaujas;
app.locals.pathLeidejasAnksciauSukurtas = variables.pathLeidejasAnksciauSukurtas;
app.locals.pathDuomenuBazes = variables.pathDuomenuBazes;
app.locals.pathDuomenuBazeNauja = variables.pathDuomenuBazeNauja;
app.locals.pathDuomenuBazeAnksciauSukurta = variables.pathDuomenuBazeAnksciauSukurta;
app.locals.Autolinker = variables.Autolinker;
app.locals.$salygaPaieskosTikNeistrintuIrasu = variables.$salygaPaieskosTikNeistrintuIrasu;




app.use(variables.pathIndex, function(req, res, next) {

  /*
  Patikrina, ar HTTP request path'o tik pradzia lygi variables.pathIndex, ar visas request path'as lygus variables.pathIndex.
   */
  if (req.path == variables.pathIndex) {
    res.redirect(variables.pathZurnalai);
  }
  else {
    next();
  }
});
app.use(variables.pathZurnalai, routesZurnaluIrLeidejuIrDuomenuBaziu);
app.use(variables.pathDuomenuBazes, routesZurnaluIrLeidejuIrDuomenuBaziu);
app.use(variables.pathLeidejai, routesZurnaluIrLeidejuIrDuomenuBaziu);

app.use('/', function(req, res, next) {
  next(variables.getObjektaError404())
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use('/', function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      // pavadinimasSvetaines: variables.pavadinimasSvetaines,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use('/', function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    // pavadinimasSvetaines: variables.pavadinimasSvetaines,
    message: err.message,
    error: {}
  });
});


module.exports = app;
