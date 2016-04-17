var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var variables = require('../routes/variables.js');



// console.log(variables);

var masyvasPathuPaieskosPagalAbecele = [];
for (var i = 0; i < variables.masyvasRaidziuAbecelesLietuviskos.length; i++) {
  masyvasPathuPaieskosPagalAbecele.push('/'+encodeURIComponent(variables.masyvasRaidziuAbecelesLietuviskos[i]));
}

// console.log('@@@@@@@@@17', masyvasPathuPaieskosPagalAbecele);

// router.get(masyvasPathuPaieskosPagalAbecele, function(req, res) {
//   var path = req.path;
//   console.log(path);
//   path = path.replace(/\//g, '');
//   path = decodeURIComponent(path);
//   console.log(path);
//   for (var numerisRaidesAbeceleje = 0; numerisRaidesAbeceleje < variables.masyvasRaidziuAbecelesLietuviskos.length; numerisRaidesAbeceleje++) {
//     if (path == variables.masyvasRaidziuAbecelesLietuviskos[numerisRaidesAbeceleje]) {
//       var MongoClient = mongodb.MongoClient;
//       MongoClient.connect(variables.urlOfDatabase, function(err, db) {
//         if (err) {
//           console.log(err);
//         }
//         else {
//           console.log('@@@@@@147');//^\s*A
//           var regExp = new RegExp('^\\s*' + path, 'i');
//           console.log('@@@@@@105', regExp);
//           var collectionZurnalai = db.collection('zurnalai');
//           var options = {
//             sort : variables.getPavadinimaFieldo(1)
//           }
//           collectionZurnalai.find({ pavadinimas1: regExp }, options).toArray(function(err, masyvasDocumentuZurnalu){
//             if (err) {
//               console.log('@@@@@@151', err);
//             }
//             else {
//               console.log('@@@@@@@@@154');
//               console.log('masyvasZurnaluDocumentu1: ', masyvasDocumentuZurnalu, '@@@');
//               res.render('index', {
//                 // pavadinimasSvetaines: variables.pavadinimasSvetaines,
//                 // pristatymasSvetaines: variables.pristatymasSvetaines,
//                 masyvasDocumentuZurnalu: masyvasDocumentuZurnalu,
//                 // getPavadinimaStulpelio: variables.getPavadinimaStulpelio,
//                 // getPavadinimaFieldo: variables.getPavadinimaFieldo,
//                 // kiekisStulpeliuRodomu: variables.kiekisStulpeliuRodomu,
//                 // masyvasRaidziuAbecelesLietuviskos: variables.masyvasRaidziuAbecelesLietuviskos
//               });
//               db.close(function() {
//                 console.log('Tiketina, kad ivykdyta db.close()')
//               });
//             }
//           });
//         }
//       });
//     }
//   }
// });


// /* GET
// home page. */
// router.get('/', function(req, res, next) {
//   next();
// });

// router.get(variables.pathPaiesku, function(req, res, next) {
//   if (Object.keys(req.query).length) {
//     var masyvasPavadinimuParametruInQuery = Object.keys(req.query);
//     console.log('@@@@@@@12', req.query);  // printoutina: @@@@@@@12 { regex: '/gr/i' }
//     if (masyvasPavadinimuParametruInQuery.length == 1) {
//       var pavadinimasParametro = masyvasPavadinimuParametruInQuery[0];
//       if (pavadinimasParametro == variables.parametrasQueryPaieskuPagalRegex) {
//         next();
//       }
//       else {
//
//         // Kadanors gal papildysiu dar paiesku funkcionaluma.
//       }
//     }
//     else {
//
//       // Kadanors gal papildysiu dar paiesku funkcionaluma.
//     }
//   }
//   else {
//
//     // Kadanors gal papildysiu dar paiesku funkcionaluma.
//   }
// });

router.get(masyvasPathuPaieskosPagalAbecele, function(req, res) {
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
});

router.get(['/', variables.pathPaiesku], function(req, res, next) {
// router.get('/', function(req, res, next) {
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
        if (Object.keys(req.query).length) {
          console.log('@@@@@@@@55', req.query);

          /*
           Cia assuminam, kad yra '/ieskoti?regex=NNN...' route
           Tures but objektasZurnaluPaieskosMongoDb =
           {  $or: [ { keyA: 'valueA' }, {keyB: 'valueB'} ]  }
           */
          var $or = [];
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
            var errOfRegex = new Error(variables.pranesimasFrazePaieskosNegera);
            next(errOfRegex);
          }
          console.log('@@@@@@@@1411', regexPaieskos);
          for (var i = 1; i < variables.kiekisStulpeliuRodomu; i++) {
            var objektasPaieskosMasyvo$or = {};
            objektasPaieskosMasyvo$or[variables.getPavadinimaFieldo(i)] = regexPaieskos;
            $or.push(objektasPaieskosMasyvo$or);
          }
          objektasZurnaluPaieskosMongoDb['$or'] = $or;
        }
        else {

          /*
           Cia '/' route, NES req.query == null or smth.
           */
          objektasZurnaluPaieskosMongoDb = {};
          console.log('@@@@@721', objektasZurnaluPaieskosMongoDb);
          console.log('@@@@@722', variables.getPavadinimaFieldo('pavadinimas1'));
        }
        var options = {
          sort : variables.getPavadinimaFieldo('pavadinimas1')
        };
        console.log('@@@@@@@@199', options);
        collectionZurnalai.find(objektasZurnaluPaieskosMongoDb, options).toArray(function(err, masyvasDocumentuZurnalu){
          if (err) {
            console.log('@@@@@56', err);
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
});


// router.get(['/', variables.pathPaiesku], function(req, res, next) {
//   var MongoClient = mongodb.MongoClient;
//   MongoClient.connect(variables.urlOfDatabase, function(err, db) {
//     if (err) {
//       console.log('@@@@@@@@101 Erroras meginant connectintis prie mongoDBZurnaluProjekto:', err);
//     }
//     else {
//       try {
//         console.log('Prisijungem prie mongoDBZurnaluProjekto!');
//         var collectionZurnalai = db.collection('zurnalai');
//         var objektasZurnaluPaieskosMongoDb = {};
//         var regexPaieskos = '';
//         if (Object.keys(req.query).length) {
//           console.log('@@@@@@@@55', req.query);
//
//           /*
//               Cia assuminam, kad yra '/ieskoti?regex=NNN...' route
//               Tures but objektasZurnaluPaieskosMongoDb =
//               {  $or: [ { keyA: 'valueA' }, {keyB: 'valueB'} ]  }
//           */
//           var $or = [];
//           try {
//             regexPaieskos = req.query[variables.parametrasQueryPaieskuPagalRegex];
//             console.log('@@@@@@@@133', regexPaieskos);
//             regexPaieskos = regexPaieskos.substr(1);
//             if ('i' == regexPaieskos.substr(regexPaieskos.length-1)) {
//               regexPaieskos = regexPaieskos.substr(0, regexPaieskos.length-2);
//               regexPaieskos = new RegExp(regexPaieskos, 'i');
//             }
//             else if ('/' == regexPaieskos.substr(regexPaieskos.length-1)) {
//               regexPaieskos = regexPaieskos.substr(0, regexPaieskos.length-1);
//               regexPaieskos = new RegExp(regexPaieskos);
//             }
//           }
//           catch (errOfRegex) {
//             var errOfRegex = new Error(variables.pranesimasFrazePaieskosNegera);
//             next(errOfRegex);
//           }
//           console.log('@@@@@@@@1411', regexPaieskos);
//           for (var i = 1; i < variables.kiekisStulpeliuRodomu; i++) {
//             var objektasPaieskosMasyvo$or = {};
//             objektasPaieskosMasyvo$or[variables.getPavadinimaFieldo(i)] = regexPaieskos;
//             $or.push(objektasPaieskosMasyvo$or);
//           }
//           objektasZurnaluPaieskosMongoDb['$or'] = $or;
//         }
//         else {
//
//           /*
//            Cia '/' route, NES req.query == null or smth.
//           */
//           objektasZurnaluPaieskosMongoDb = {};
//           console.log('@@@@@72', objektasZurnaluPaieskosMongoDb);
//         }
//         var options = {
//           sort : variables.getPavadinimaFieldo(1)
//         }
//         collectionZurnalai.find(objektasZurnaluPaieskosMongoDb, options).toArray(function(err, masyvasDocumentuZurnalu){
//           if (err) {
//             console.log('@@@@@56', err);
//           }
//           else {
//             console.log('@@@@@@81', 'masyvasZurnaluDocumentu YRA ', masyvasDocumentuZurnalu, '@@@');
//             res.render('index', {
//               masyvasDocumentuZurnalu: masyvasDocumentuZurnalu
//             });
//             db.close(function() {
//               console.log('Tiketina, kad ivykdyta db.close()')
//             });
//           }
//         });
//       }
//       catch (err) {
//         next();
//       }
//     }
//   });
// });




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


router.get('/naujasirasas', function(req, res) {
  res.render('naujasirasas');
});

router.post('/naujasirasasposted', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
    }
    else {
      var documentNaujoZurnalo = {};
      console.log('118@@@@@@', req.body.pavadinimas1, '@@@@@@@@118');
      for (var numerisFieldoIrStulpelio = 1; numerisFieldoIrStulpelio < variables.kiekisStulpeliuRodomu; numerisFieldoIrStulpelio++) {
        documentNaujoZurnalo[variables.getPavadinimaFieldo(numerisFieldoIrStulpelio)] = ( req.body[variables.getPavadinimaFieldo(numerisFieldoIrStulpelio)] ).trim();
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



module.exports = router;