var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var variables = require('../routes/variables.js');

var masyvasPathuKaiBusAtvaizduojamaZurnaluLentele = ['/', variables.pathPaiesku];


/* GET home page. */
router.get('/', function(req, res, next) {
  next();
});



router.get(masyvasPathuKaiBusAtvaizduojamaZurnaluLentele, function(req, res, next) {

  var MongoClient = mongodb.MongoClient;
  // res.render('index', { title: 'Lietuvos mokslo žurnalai' });
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log('Erroras meginant connectintis prie mongoDBZurnaluProjekto:', err);
    }
    else {
      console.log('Prisijungem prie mongoDBZurnaluProjekto!');
      var collectionZurnalai = db.collection('zurnalai');
      console.log('aaa');
      collectionZurnalai.find({


      }).toArray(function(err, masyvasDocumentuZurnalu){
        if (err) {
          console.log('Pri');
          console.log(err);
        }
        // else if (sarasasZurnalu.length) {
        //
        // }
        else {
          console.log('masyvasZurnaluDocumentu1: ', masyvasDocumentuZurnalu, '@@@');
          res.render('index', {
            pavadinimasSvetaines: variables.pavadinimasSvetaines,
            pristatymasSvetaines: variables.pristatymasSvetaines,
            masyvasDocumentuZurnalu: masyvasDocumentuZurnalu,
            getPavadinimaStulpelio: variables.getPavadinimaStulpelio,
            getPavadinimaFieldo: variables.getPavadinimaFieldo,
            kiekisStulpeliuRodomu: variables.kiekisStulpeliuRodomu,
            masyvasRaidziuAbecelesLietuviskos: variables.masyvasRaidziuAbecelesLietuviskos
          });
          db.close(function() {
            console.log('Tiketina, kad ivykdyta db.close()')
          });
        }
      });
    }
  });

});


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   var MongoClient = mongodb.MongoClient;
//   // res.render('index', { title: 'Lietuvos mokslo žurnalai' });
//   MongoClient.connect(variables.urlOfDatabase, function(err, db) {
//     if (err) {
//       console.log('Erroras meginant connectintis prie mongoDBZurnaluProjekto:', err);
//     }
//     else {
//       console.log('Prisijungem prie mongoDBZurnaluProjekto!');
//       var collectionZurnalai = db.collection('zurnalai');
//       console.log('aaa');
//       collectionZurnalai.find().toArray(function(err, masyvasDocumentuZurnalu){
//         if (err) {
//           console.log('Pri');
//           console.log(err);
//         }
//         // else if (sarasasZurnalu.length) {
//         //
//         // }
//         else {
//           console.log('masyvasZurnaluDocumentu1: ', masyvasDocumentuZurnalu, '@@@');
//           res.render('index', {
//             pavadinimasSvetaines: variables.pavadinimasSvetaines,
//             pristatymasSvetaines: variables.pristatymasSvetaines,
//             masyvasDocumentuZurnalu: masyvasDocumentuZurnalu,
//             getPavadinimaStulpelio: variables.getPavadinimaStulpelio,
//             getPavadinimaFieldo: variables.getPavadinimaFieldo,
//             kiekisStulpeliuRodomu: variables.kiekisStulpeliuRodomu,
//             masyvasRaidziuAbecelesLietuviskos: variables.masyvasRaidziuAbecelesLietuviskos
//           });
//           db.close(function() {
//             console.log('Tiketina, kad ivykdyta db.close()')
//           });
//         }
//       });
//     }
//   });
// });

router.get(variables.pathPaiesku, function(req, res, next) {
  if (req.query) {
    var masyvasPavadinimuParametruInQuery = Object.keys(req.query);
    console.log('@@@@@@@12', req.query);  // printoutina: @@@@@@@12 { regex: '/gr/i' }
    if (masyvasPavadinimuParametruInQuery.length == 1) {
      var pavadinimasParametro = masyvasPavadinimuParametruInQuery[0];
      if (pavadinimasParametro == variables.parametrasQueryPaieskuPagalRegex) {

      }
      else {

        // Kadanors gal papildysiu dar paiesku funkcionaluma.
      }
    }
    else {

      // Kadanors gal papildysiu dar paiesku funkcionaluma.
    }
  }
});

router.get('/naujasirasas', function(req, res) {
  res.render('naujasirasas', {
    pavadinimasSvetaines: variables.pavadinimasSvetaines,
    getPavadinimaStulpelio: variables.getPavadinimaStulpelio,
    getPavadinimaFieldo: variables.getPavadinimaFieldo,
    kiekisStulpeliuRodomu: variables.kiekisStulpeliuRodomu
  });
});

router.post('/naujasirasasposted', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
    }
    else {
      var documentNaujoZurnalo = {};
      var pavadinimasStulpelio = '';
      var pavadinimasFieldo = '';
      console.log('118@@@@@@', req.body.pavadinimas1, '@@@@@@@@118');
      for (var numerisFieldoIrStulpelio = 1; numerisFieldoIrStulpelio < variables.kiekisStulpeliuRodomu; numerisFieldoIrStulpelio++) {
        documentNaujoZurnalo[variables.getPavadinimaFieldo(numerisFieldoIrStulpelio)] = req.body[variables.getPavadinimaFieldo(numerisFieldoIrStulpelio)];
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
});





router.get('/*', function(req, res) {
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
          collectionZurnalai.find({ pavadinimas1: regExp }).toArray(function(err, result){
            if (err) {
              console.log('@@@@@@151', err);
            }
            else {
              console.log('@@@@@@@@@154', result);
              //res.render






            }
          });
        }
      });
    }
  }
});






/* GET @@@authentificavimo puslapis. */
router.get('/prisijungimas', function(req, res, next) {
  res.render('prisijungimas', { title: 'Lietuvos mokslo žurnalai' });
});



/* GET Userlist page. */
router.get('/useriusarasas', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
    res.render('useriusarasas', {
      "useriusarasas" : docs
    });
  });
});



module.exports = router;