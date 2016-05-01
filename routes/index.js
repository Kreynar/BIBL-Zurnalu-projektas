var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

var variables = require('../routes/variables.js');



var trintiDocumentsZurnalu = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
    }
    else {
      var collectionZurnalai = db.collection('zurnalai');
      var masyvasIdDocumentuPazymetu = req.body.masyvasIdDocumentuPazymetu;
      masyvasIdDocumentuPazymetu = JSON.parse(masyvasIdDocumentuPazymetu);
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
          //$set : { 'pastabos' : '' }
          $set : { 'aristrintas' : true }
        },
        function(err, result) {
          if (err) {
            console.log(err);
            next(err);
          }
          else {
            // next();
            res.send({ 'statusas' : 'ok' });
            db.close();
          }
        }
      );
    }
  });
};

var getObjektaQueryPagalRaideArbaFraze = function(req, res, next, id) {
  var $salygaPaieskosPagalRaideArbaFraze = {};
  var regExp = null;
  var objektasQuery = {};
  try {
    if (!req.query.raide && !req.query.fraze) {

    }
    // else if (req.query.raide && variables.masyvasRaidziuAbecelesLietuviskos.indexOf(req.query.raide) > -1) {
    else if (req.query.raide && (req.query.raide + '').length === 1) {
      regExp = new RegExp('^\\s*' + req.query.raide, 'i');
      $salygaPaieskosPagalRaideArbaFraze = { 'pavadinimas1' : regExp };
    }
    else if (req.query.fraze) {
      regExp = new RegExp(req.query.fraze, 'i');
      $salygaPaieskosPagalRaideArbaFraze = {
        '$or' : [
          {'pavadinimas1' : regExp }
          , {'pavadinimas2' : regExp}
          , {'issn' : regExp}
          , {'leidejas' : regExp}
          , {'db' : regExp}
          , {'pastabos' : regExp}
        ]
      };
    }
    objektasQuery = { '$and' : [variables.$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalRaideArbaFraze] };
    return objektasQuery;
  }
  catch (err) {
    console.log(err);
    err = new Error(variables.pranesimasFrazePaieskosNegera);
    next(err);
  }
};

var getObjektaQueryPagalId = function(idZurnalo) {
  var objektasQuery;
  var $salygaPaieskosPagalId = { '_id' : new mongodb.ObjectId(idZurnalo) };
  objektasQuery = { '$and' : [variables.$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalId] };
  return objektasQuery;
};

var getZurnalusIsDbIrAtvaizduotiPuslapyje = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var objektasQuery = {};
  var objektasSort = {'pavadinimas1':1};
  var puslapisRenderinamas = '';
  var objektasKintamuju = {};
  var idZurnalo = req.params.id || '';
  // >>>>>>>>>>>
  if (idZurnalo) {
    try {
      objektasQuery = getObjektaQueryPagalId(idZurnalo);
    }
    catch (err) {
      var err = new Error(variables.pranesimas404);
      err.status = 404;
      next(err);
    }
  }
  else {
    objektasQuery = getObjektaQueryPagalRaideArbaFraze(req, res, next);
  }
  // <<<<<<<<<<<<<
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
      next(err);
    }
    else {
      console.log(JSON.stringify(objektasQuery, null, 2));
      var collectionZurnalai = db.collection('zurnalai');
      console.log(JSON.stringify(objektasQuery, null, 4));
      collectionZurnalai.find(objektasQuery).sort(objektasSort).toArray(function(err, masyvasZurnalu) {
        if (err) {
          console.log(err);
          next(err);
        }
        else if (idZurnalo) {
          if (!masyvasZurnalu) {
            var err = new Error(variables.pranesimas404);
            err.status = 404;
            next(err);
          }
          else if (masyvasZurnalu.length == 0) {
            var err = new Error(variables.pranesimas404);
            err.status = 404;
            next(err);
          }
          puslapisRenderinamas = 'formaZurnaloRedagavimo';
          objektasKintamuju = {'headeris': 'Įrašo keitimas', 'documentZurnalo': masyvasZurnalu[0]};
        }
        else {
          puslapisRenderinamas = 'index';
          objektasKintamuju = { 'masyvasDocumentuZurnalu': masyvasZurnalu };
        }
        res.render(puslapisRenderinamas, objektasKintamuju);
        // <<<<<<<<<<<
        db.close(function() {
          console.log('Tiketina, kad ivykdyta db.close()')
        });
      });
    }
  });
};

var sukurtiNaujaArbaPakeistiSenaIrasa = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var objektasQuery = {};
  var objektasUpdate = {};
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
      next(err);
    }
    else {
      var documentNaujoZurnalo = {};
      for (var numerisFieldoArbaStulpelio = 0; numerisFieldoArbaStulpelio < variables.kiekisStulpeliuArbaFieldu; numerisFieldoArbaStulpelio++) {
        if (variables.gerArFiksuojamasStulpelisDuomenuBazeje(numerisFieldoArbaStulpelio)
            && variables.getAliasStulpelioArbaFieldo(numerisFieldoArbaStulpelio) != 'id'
            && variables.getAliasStulpelioArbaFieldo(numerisFieldoArbaStulpelio) != 'arIstrintas') {
          documentNaujoZurnalo[variables.getPavadinimaFieldo(numerisFieldoArbaStulpelio)]
              = ( req.body[variables.getPavadinimaFieldo(numerisFieldoArbaStulpelio)] ).trim();
        }
      }
      var collectionZurnalai = db.collection('zurnalai');
      if (req.params.id) {
        try {
          objektasQuery = getObjektaQueryPagalId(req.params.id);
          objektasUpdate = { '$set' : documentNaujoZurnalo };
          collectionZurnalai.updateOne(objektasQuery, objektasUpdate, {'upsert' : false},  function(err, result) {
            if (err) {
              console.log(err);
              next(err);
            }
            else {
              res.redirect(variables.pathCollectionZurnalu);
            }
          });
        }
        catch (err) {
          var err = new Error(variables.pranesimas404);
          err.status = 404;
          next(err);
        }
      }
      else {
        collectionZurnalai.insertOne(documentNaujoZurnalo, function(err, result) {
          db.close();
          if (err) {
            console.log(err);
            next(err);
          }
          else {
            res.redirect(variables.pathCollectionZurnalu);
          }
        });
      }
    }
  });
};


router.get(variables.pathCollectionZurnalu, getZurnalusIsDbIrAtvaizduotiPuslapyje);

router.delete(variables.pathCollectionZurnalu, trintiDocumentsZurnalu);

router.get(variables.pathZurnalasNaujas, function(req, res) {
  res.render('formaZurnaloRedagavimo', { 'headeris' : 'Naujas įrašas' } );
});

/* Sitas route handleris kode turi but apacioje nuo visu kitu '/<stringKonstanta>'! */
router.get(variables.pathZurnalasAnksciauSukurtas, getZurnalusIsDbIrAtvaizduotiPuslapyje);

router.post(variables.pathZurnalasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa);

router.post(variables.pathZurnalasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa);



// router.get(variables.masyvasPathuPaieskosPagalAbecele, getIrasusIsDbPagalAbeceleIrUzpildytiLentele);
//
// router.get(['/', variables.pathPaiesku], getIrasusIsDbPagalFrazeIrUzpildytiLentele);

// router.get(variables.pathZurnalasNaujas, function(req, res) {
//   res.render('naujasirasas');
// });

// router.post(variables.pathPostNaujaIrasa, postNaujaIrasa);

// router.post(variables.pathTrintiIrasa, trintiDocumentsZurnalu);





module.exports = router;