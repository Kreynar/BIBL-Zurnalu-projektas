var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');



/*
  Duomenu bazes adresas.
 */
var urlOfDatabase = 'mongodb://localhost:27017/mongoDBZurnaluProjekto';

/*
  Sito masyvo elementu pavadinimus gali tekti pakeisti, jei keisis duomenu bazeje
  field'u pavadinimai (arba bus nauju fieldu, kuriuos reikes atvaizduoti
  lenteleje)!!!!!!!!!!!!!!!!!!!!
 */
var masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu = [

  /*
  <fieldoPavadinimasDuombazeje>       <stulpelioPavadinimasLentelejeSvetaineje>
  */
  [null,                                    'Nr.'],                       // 0
  ['pavadinimas1',                         'Pavadinimas'],                // 1
  ['pavadinimas2',                          'Kitas pavadinimas'],         // 2
  ['issn',                                  'ISSN'],                      // 3
  ['leidejas',                              'Leidėjas'],                  // 4
  ['db',                                   'Duomenų bazė'],               // 5
  ['pastabos',                              'Pastabos']                   // 6
];

var getPavadinimaStulpelio = function(numerisStulpelio) {
  return masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu[numerisStulpelio][1];
}

var getPavadinimaFieldo = function(numerisFieldo) {
  return masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu[numerisFieldo][0];
}

var kiekisStulpeliuRodomu = masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu.length;

var pavadinimasSvetaines = 'Lietuvos mokslo žurnalų sąrašas';

var pristatymasSvetaines = 'Sveiki atvykę į Lietuvos mokslo žurnalų internetinę svetainę!' +
    ' Čia galite rasti visų mokslo bendruomenės žurnalų sąrašą bei sužinoti, kokiose duomenų' +
    ' bazėse talpinamas pilnas šių žurnalų turinys.';

var masyvasRaidziuAbecelesLietuviskos = [
  'A', 'Ą', 'B', 'C', 'Č', 'D', 'E', 'Ę', 'Ė','F'
  ,'G','H', 'I', 'Į', 'Y', 'J', 'K', 'L', 'M'
  ,'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ų', 'Ū', 'V', 'Z', 'Ž'
    ];




/* GET home page. */
router.get('/', function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  // res.render('index', { title: 'Lietuvos mokslo žurnalai' });
  MongoClient.connect(urlOfDatabase, function(err, db) {
    if (err) {
      console.log('Erroras meginant connectintis prie mongoDBZurnaluProjekto:', err);
    }
    else {
      console.log('Prisijungem prie mongoDBZurnaluProjekto!');
      var collectionZurnalai = db.collection('zurnalai');
      collectionZurnalai.find();
      console.log('aaa');
      collectionZurnalai.find().toArray(function(err, masyvasDocumentuZurnalu){
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
            pavadinimasSvetaines: pavadinimasSvetaines,
            pristatymasSvetaines: pristatymasSvetaines,
            masyvasDocumentuZurnalu: masyvasDocumentuZurnalu,
            getPavadinimaStulpelio: getPavadinimaStulpelio,
            getPavadinimaFieldo: getPavadinimaFieldo,
            kiekisStulpeliuRodomu: kiekisStulpeliuRodomu,
            masyvasRaidziuAbecelesLietuviskos: masyvasRaidziuAbecelesLietuviskos
          });
          db.close(function() {
            console.log('Tiketina, kad ivykdyta db.close()')
          });
        }
      });
    }
  });
});


router.get('/naujasirasas', function(req, res) {
  res.render('naujasirasas', {
    pavadinimasSvetaines: pavadinimasSvetaines,
    getPavadinimaStulpelio: getPavadinimaStulpelio,
    getPavadinimaFieldo: getPavadinimaFieldo,
    kiekisStulpeliuRodomu: kiekisStulpeliuRodomu
  });
});

router.post('/naujasirasasposted', function(req, res) {
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(urlOfDatabase, function(err, db) {
    if (err) {
      console.log(err);
    }
    else {
      var documentNaujoZurnalo = {};
      var pavadinimasStulpelio = '';
      var pavadinimasFieldo = '';
      console.log('118@@@@@@', req.body.pavadinimas1, '@@@@@@@@118');
      for (var numerisFieldoIrStulpelio = 1; numerisFieldoIrStulpelio < kiekisStulpeliuRodomu; numerisFieldoIrStulpelio++) {
        documentNaujoZurnalo[getPavadinimaFieldo(numerisFieldoIrStulpelio)] = req.body[getPavadinimaFieldo(numerisFieldoIrStulpelio)];
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
  path = path.replace(/\//g, '');
  for (var numerisRaidesAbeceleje = 0; numerisRaidesAbeceleje < masyvasRaidziuAbecelesLietuviskos.length; numerisRaidesAbeceleje++) {
    if (masyvasRaidziuAbecelesLietuviskos[numerisRaidesAbeceleje] == path) {
      
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