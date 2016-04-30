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
          //$set : { 'pastabos' : '' }
          $set : { 'aristrintas' : true }
        },
        function(err, result) {
          if (err) {
            console.log(err);
            next(err);
          }
          else {
            console.log('@@@@@@@@39');
            // next();
            res.send({ 'statusas' : 'ok' });
            db.close();
          }
        }
      );
    }
  });
};

var getZurnalusIsDbIrUzpildytiLentele = function(req, res, next) {
  var objektasQuery = {};
  var $salygaPaieskosTikNeistrintuIrasu = { $or : [ { aristrintas:{$exists:false} }, { aristrintas:{$ne:true} } ] };
  var $salygaPaieskosPagalRaideArbaFraze = {};
  // var $salygaPaieskosPagalRaidePirmaPavadinimo = {};
  // var $salygaPaieskosPagalFraze = {};
  var MongoClient = mongodb.MongoClient;
  var regExp = null;
  var objektasSort = {'pavadinimas1':1};
  console.log('@@@@@@@@64');
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
    objektasQuery = { '$and' : [$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalRaideArbaFraze] };
    console.log('@@@@@@@@88' + JSON.stringify(objektasQuery, null, 4));
  }
  catch (err) {
    console.log(err);
    next(err);
  }
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
      next(err);
    }
    else {
      console.log('@@@@@@147');//^\s*A
      var collectionZurnalai = db.collection('zurnalai');
      collectionZurnalai.find(objektasQuery).sort(objektasSort).toArray(function(err, masyvasZurnalu) {
        if (err) {
          console.log(err);
          next(err);
        }
        console.log('@@@@@@@@103', masyvasZurnalu, JSON.stringify(masyvasZurnalu, null, 4));
        res.render('index', {
          masyvasDocumentuZurnalu: masyvasZurnalu
        });
        db.close(function() {
          console.log('Tiketina, kad ivykdyta db.close()')
        });
      });
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


router.get(variables.pathCollectionZurnalu, getZurnalusIsDbIrUzpildytiLentele);

router.delete(variables.pathCollectionZurnalu, trintiDocumentsZurnalu);

router.get([variables.pathZurnalasNaujas, variables.pathZurnalasAnksciauSukurtas], function(req, res) {
  res.render('formaZurnaloRedagavimo');
});

router.post([variables.pathZurnalasNaujas, variables.pathZurnalasAnksciauSukurtas], function(req, res) {

  postNaujaIrasa;
  postKeitimaZurnalo;

});



// router.get(variables.masyvasPathuPaieskosPagalAbecele, getIrasusIsDbPagalAbeceleIrUzpildytiLentele);
//
// router.get(['/', variables.pathPaiesku], getIrasusIsDbPagalFrazeIrUzpildytiLentele);

// router.get(variables.pathZurnalasNaujas, function(req, res) {
//   res.render('naujasirasas');
// });

// router.post(variables.pathPostNaujaIrasa, postNaujaIrasa);

// router.post(variables.pathTrintiIrasa, trintiDocumentsZurnalu);





module.exports = router;