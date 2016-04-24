var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var variables = require('../routes/variables.js');



var trintiIrasa = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
    }
    else {
      var collectionZurnalai = db.collection('zurnalai');
      var masyvasIdDocumentuPazymetu = req.body.masyvasIdDocumentuPazymetu;
      console.log('@@@@@@@19' + req);
      console.log('@@@@@@@20' + masyvasIdDocumentuPazymetu);
      console.log('@@@@@@@21' + masyvasIdDocumentuPazymetu[0]);
      masyvasIdDocumentuPazymetu = JSON.parse(masyvasIdDocumentuPazymetu);
      console.log('@@@@@@@23' + masyvasIdDocumentuPazymetu[0]);
      for (var i = 0;  i < masyvasIdDocumentuPazymetu.length; i++) {
        masyvasIdDocumentuPazymetu[i] = new mongodb.ObjectId(masyvasIdDocumentuPazymetu[i]);
      }

      collectionZurnalai.updateMany(
        {
          '_id' : {
            $in : masyvasIdDocumentuPazymetu
          }
        },
        {
          $set : { 'pastabos' : '2016-04-24 8:4333h' }
          // $set : { 'aristrintas' : true }
        },
        function(err, result) {
          if (err) {
            console.log(err);
            next(err);
          }
          else {
            console.log('@@@@@@@@39');
            db.close();
            next();
          }
        }
      );
    }
  });
};

var getIrasusIsDbPagalAbeceleIrUzpildytiLentele = function(req, res) {
  var path = req.path;
  console.log(path);
  path = path.replace(/\//g, '');
  path = decodeURIComponent(path);
  console.log(path);
  for (var numerisRaidesAbeceleje = 0; numerisRaidesAbeceleje < variables.masyvasRaidziuAbecelesLietuviskos.length; numerisRaidesAbeceleje++) {
    if (path == variables.masyvasRaidziuAbecelesLietuviskos[numerisRaidesAbeceleje]) {
      var MongoClient = mongodb.MongoClient;
      MongoClient.connect(variables.urlOfDatabase, function(err, db) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('@@@@@@147');//^\s*A
          var regExp = new RegExp('^\\s*' + path, 'i');
          console.log('@@@@@@105', regExp);
          var collectionZurnalai = db.collection('zurnalai');
          var options = {
            sort : variables.getPavadinimaFieldo('pavadinimas1')
          };
          collectionZurnalai.find({ pavadinimas1: regExp }, options).toArray(function(err, masyvasDocumentuZurnalu){
            if (err) {
              console.log('@@@@@@151', err);
            }
            else {
              console.log('@@@@@@@@@154');
              console.log('masyvasZurnaluDocumentu1: ', masyvasDocumentuZurnalu, '@@@');
              res.render('index', {
                masyvasDocumentuZurnalu: masyvasDocumentuZurnalu
              });
              db.close(function() {
                console.log('Tiketina, kad ivykdyta db.close()')
              });
            }
          });
        }
      });
    }
  }
};

var getIrasusIsDbPagalFrazeIrUzpildytiLentele = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log('@@@@@@@@101 Erroras meginant connectintis prie mongoDBZurnaluProjekto:', err);
    }
    else {
      try {
        console.log('Prisijungem prie mongoDBZurnaluProjekto!');
        var collectionZurnalai = db.collection('zurnalai');
        var objektasZurnaluPaieskosMongoDb = {};
        var regexPaieskos = '';
        var $or1 = [];
        if (Object.keys(req.query).length) {
          console.log('@@@@@@@@55', req.query);

          /*
           Cia assuminam, kad yra '/ieskoti?regex=NNN...' route
           Tures but objektasZurnaluPaieskosMongoDb =
           {  $or: [ { keyA: 'valueA' }, {keyB: 'valueB'} ]  }
           */
          try {
            regexPaieskos = req.query[variables.parametrasQueryPaieskuPagalRegex];
            console.log('@@@@@@@@133', regexPaieskos);
            regexPaieskos = regexPaieskos.substr(1);
            if ('i' == regexPaieskos.substr(regexPaieskos.length-1)) {
              regexPaieskos = regexPaieskos.substr(0, regexPaieskos.length-2);
              regexPaieskos = new RegExp(regexPaieskos, 'i');
            }
            else if ('/' == regexPaieskos.substr(regexPaieskos.length-1)) {
              regexPaieskos = regexPaieskos.substr(0, regexPaieskos.length-1);
              regexPaieskos = new RegExp(regexPaieskos);
            }
          }
          catch (errOfRegex) {
            errOfRegex = new Error(variables.pranesimasFrazePaieskosNegera);
            next(errOfRegex);
          }
          console.log('@@@@@@@@1411', regexPaieskos);
          console.log('@@@@@@@@1411', variables.kiekisStulpeliuArbaFieldu);
          for (var numerisStulpelioArbaFieldo = 0; numerisStulpelioArbaFieldo < variables.kiekisStulpeliuArbaFieldu; numerisStulpelioArbaFieldo++) {
            if (variables.gerArFiksuojamasStulpelisDuomenuBazeje(numerisStulpelioArbaFieldo)
                && variables.getAliasStulpelioArbaFieldo(numerisStulpelioArbaFieldo) != 'id' ) {
              var objektasPaieskosMasyvo$or1 = {};
              objektasPaieskosMasyvo$or1[variables.getPavadinimaFieldo(numerisStulpelioArbaFieldo)] = regexPaieskos;
              $or1.push(objektasPaieskosMasyvo$or1);
            }
          }
        }
        else {

          /*
           Cia '/' route, NES req.query == null or smth.
           */
          $or1.push({});
        }

        /*
         Dabar sudarau antraji siai paieskai reikalinga $or[ ] masyva.
         Si dalis paieskos objekte bus atsakinga uz pafetchinima TIK tu Document'u,
         kurie arba isvis neturi fieldo 'aristrintas', arba ju 'aristrintas'=false.
         */
        var $or2 = [ { aristrintas:{$exists:false} }, { aristrintas:{$ne:true} } ];

        /*
         Galiausiai, paieskos-query objektas turi atrodyti mazdaug taip:
         {
         $and: [
         { $or:[ {pavadinimas1:FRAZE}, ..., {pastabos:FRAZE} ] },
         { $or:[ { aristrintas:{$exists:false} }, { aristrintas:{$ne:true} } ] }
         ]
         }

         */
        var $and = [
          {'$or' : $or1}
          , {'$or' : $or2}
        ];
        objektasZurnaluPaieskosMongoDb = { '$and' : $and };
        var options = {
          sort : variables.getPavadinimaFieldo('pavadinimas1')
        };
        // console.log('@@@@@@@@199', objektasZurnaluPaieskosMongoDb);
        collectionZurnalai.find(objektasZurnaluPaieskosMongoDb, options).toArray(function(err, masyvasDocumentuZurnalu){
          if (err) {
            console.log('@@@@@56', err, objektasZurnaluPaieskosMongoDb);
          }
          else {
            console.log('@@@@@@81', 'masyvasZurnaluDocumentu YRA ', masyvasDocumentuZurnalu, '@@@');
            res.render('index', {
              masyvasDocumentuZurnalu: masyvasDocumentuZurnalu
            });
            db.close(function() {
              console.log('Tiketina, kad ivykdyta db.close()')
            });
          }
        });
      }
      catch (err) {
        next();
      }
    }
  });
};

var postNaujaIrasa = function(req, res) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
    }
    else {
      var documentNaujoZurnalo = {};
      console.log('118@@@@@@', req.body.pavadinimas1, '@@@@@@@@118');
      for (var numerisFieldoArbaStulpelio = 0; numerisFieldoArbaStulpelio < variables.kiekisStulpeliuArbaFieldu; numerisFieldoArbaStulpelio++) {
        if (variables.gerArFiksuojamasStulpelisDuomenuBazeje(numerisFieldoArbaStulpelio)
            && variables.getAliasStulpelioArbaFieldo(numerisFieldoArbaStulpelio) != 'id'
            && variables.getAliasStulpelioArbaFieldo(numerisFieldoArbaStulpelio) != 'arIstrintas') {
          documentNaujoZurnalo[variables.getPavadinimaFieldo(numerisFieldoArbaStulpelio)]
              = ( req.body[variables.getPavadinimaFieldo(numerisFieldoArbaStulpelio)] ).trim();
        }
      }
      console.log('121@@@@@@', documentNaujoZurnalo, '@@@@@@@@121');
      var collectionZurnalai = db.collection('zurnalai');
      collectionZurnalai.insert([documentNaujoZurnalo], function(err, result) {
        if (err) {
          console.log(err);
        }
        else {
          res.redirect('/');
        }
        db.close();
      });
    }
  });
};

var reloadintiPuslapiSuAtnaujintaisIrasais = function(req, res, next) {
  var urlOfPage = req.body.urlOfPageInClientCurrently;
  console.log('@@@@@@@@235', urlOfPage, variables.pathIrQueryPaieskuPagalRegexBeReiksmesParametro);
  if (urlOfPage.indexOf(variables.pathIrQueryPaieskuPagalRegexBeReiksmesParametro) > -1) {
    console.log('@@@@@@@@237');
    getIrasusIsDbPagalFrazeIrUzpildytiLentele(req, res, next);
  } 
  // else if (urlOfPage.indexOf(variables.pathPaiesku)) {
  else {
    console.log('@@@@@@@@242');
    getIrasusIsDbPagalAbeceleIrUzpildytiLentele(req, res, next);
  }
};



router.get(variables.masyvasPathuPaieskosPagalAbecele, getIrasusIsDbPagalAbeceleIrUzpildytiLentele);

router.get(['/', variables.pathPaiesku], getIrasusIsDbPagalFrazeIrUzpildytiLentele);

router.get(variables.pathSukurtiNaujaIrasa, function(req, res) {
  res.render('naujasirasas');
});

router.post(variables.pathPostNaujaIrasa, postNaujaIrasa);

router.post(variables.pathTrintiIrasa, trintiIrasa, reloadintiPuslapiSuAtnaujintaisIrasais);





module.exports = router;