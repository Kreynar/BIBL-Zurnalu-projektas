var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var variables = require('../variables.js');



var trintiIrasus = function(req, res, next) {
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      next(variables.getObjektaErrorTechniniaiNesklandumai(err));
    }
    else {
      var masyvasIdDocumentuPazymetu = req.body.masyvasIdDocumentuPazymetu;
      masyvasIdDocumentuPazymetu = JSON.parse(masyvasIdDocumentuPazymetu);
      for (var i = 0;  i < masyvasIdDocumentuPazymetu.length; i++) {
        masyvasIdDocumentuPazymetu[i] = new mongodb.ObjectId(masyvasIdDocumentuPazymetu[i]);
      }
      db.collection(pavadinimasCollection).updateMany(
        {
          '_id' : {
            $in : masyvasIdDocumentuPazymetu
          }
        },
        {
          $set : { 'aristrintas' : true }
        },
        function(err, result) {
          if (err) {
            next(variables.getObjektaErrorTechniniaiNesklandumai(err));
          }
          else {
            res.send({ 'statusas' : 'ok' });
            db.close();
          }
        }
      );
    }
  });
};

var getObjektaQueryPagalRaideArbaFraze = function(req, res, next) {
  var $salygaPaieskosPagalRaideArbaFraze = {};
  var regExp = null;
  var objektasQuery = {};
  try {
    if (!req.query.raide && !req.query.fraze) {

      /*
      Kol kas dizaine nenumatoma galimybe ieskoti vienu metu pagal raide IR fraze.
       */
    }
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
    next(variables.getObjektaErrorNegeraPaieskosFraze(err));
  }
};

var getObjektaQueryPagalId = function(req, res, next) {
  var objektasQuery;
  var $salygaPaieskosPagalId = { '_id' : new mongodb.ObjectId(req.params.id) };
  objektasQuery = { '$and' : [variables.$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalId] };
  return objektasQuery;
};

var getObjektaSort = function(req, res, next) {
  var objektasSort;
  if (req.baseUrl == variables.pathZurnalai) {
    objektasSort = {'pavadinimas1':1};
  }
  else if (req.baseUrl == variables.pathLeidejai) {
    objektasSort = {'pavadinimas1':1}; // Cia gali keistis stulpelis, pagal kuri sortinam
  }
  else if (req.baseUrl == variables.pathDuomenuBazes) {
    objektasSort = {'pavadinimas1':1}; // Cia gali keistis stulpelis, pagal kuri sortinam
  }
  else {
    next(variables.getObjektaError404());
  }
  return objektasSort;
};

var getPavadinimaPuslapioRenderinamo = function(req, res, next) {
  var pavadinimasPuslapioRenderinamo;
  if (req.params.id) {
    pavadinimasPuslapioRenderinamo = 'formaIrasoRedagavimo';
  }
  else {
    pavadinimasPuslapioRenderinamo = 'puslapisIrasuLenteles';
  }
  return pavadinimasPuslapioRenderinamo;
};

var getObjektaQuery = function(req, res, next) {
  var objektasQuery;
  if (req.params.id) {
    try {
      objektasQuery = getObjektaQueryPagalId(req.params.id);
    }
    catch (err) {
      next(variables.getObjektaError404(err));
    }
  }
  else {
    objektasQuery = getObjektaQueryPagalRaideArbaFraze(req, res, next);
  }
  return objektasQuery;
};

var getPavadinimaCollection = function(req, res, next) {
  if (req.baseUrl == variables.pathZurnalai) {
    return 'zurnalai';
  }
  else if (req.baseUrl == variables.pathLeidejai) {
    return 'leidejai';
  }
  else if (req.baseUrl == variables.pathDuomenuBazes) {
    return 'duomenubazes';
  }
  else {
    
    /*
    Dizaine nenumatyta kol kas kitokiu base pathu = uzmountintu pathu (per app.use(pathas, ...)
     */
    next(variables.getObjektaErrorTechniniaiNesklandumai());
  }
};

var getObjektaKintamujuReikalingaIrasuGavimuiIrAtvaizdavimui = function(req, res, next) {
  var objektasKintamuju = {};
  objektasKintamuju.MongoClient = mongodb.MongoClient;
  objektasKintamuju.idIraso = req.params.id || '';
  objektasKintamuju.objektasSort = getObjektaSort(req, res, next);
  objektasKintamuju.pavadinimasPuslapioRenderinamo = getPavadinimaPuslapioRenderinamo(req, res, next);
  objektasKintamuju.objektasQuery = getObjektaQuery(req, res, next);
  objektasKintamuju.pavadinimasCollection = getPavadinimaCollection(req, res, next);
  return objektasKintamuju;
};

var getIrasusIsDbIrRenderPuslapi = function(req, res, next, objektasKintamuju) {
  var collectionIrasu;
  var objektasKintamujuPerduodamuIJade;
  objektasKintamuju.MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      next(variables.getObjektaErrorTechniniaiNesklandumai(err));
    }
    else {
      // console.log(JSON.stringify(objektasQuery, null, 2));
      collectionIrasu = db.collection(objektasKintamuju.pavadinimasCollection);
      // console.log(JSON.stringify(objektasQuery, null, 4));
      collectionIrasu.find(objektasKintamuju.objektasQuery).sort(objektasKintamuju.objektasSort).toArray(function(err, masyvasIrasu) {
        if (err) {
          next(variables.getObjektaErrorTechniniaiNesklandumai(err));
        }
        else if (objektasKintamuju.idIraso) {
          if (!masyvasIrasu) {
            next(variables.getObjektaError404());
          }
          else if (masyvasIrasu.length == 0) {
            next(variables.getObjektaError404());
          }
          objektasKintamujuPerduodamuIJade = {'headeris': 'Įrašo keitimas', 'documentIraso': masyvasIrasu[0]};
        }
        else {

          objektasKintamujuPerduodamuIJade = { 'masyvasDocumentu': masyvasIrasu };
        }
        res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
        // <<<<<<<<<<<
        db.close(function() {
          console.log('Tiketina, kad ivykdyta db.close()')
        });
      });
    }
  });
};

var getIrasusIsDbIrAtvaizduotiPuslapyje = function(req, res, next) {
  var objektasKintamuju = getObjektaKintamujuReikalingaIrasuGavimuiIrAtvaizdavimui(req, res, next);
  getIrasusIsDbIrRenderPuslapi(req, res, next, objektasKintamuju);
};

var getKiekiStulpeliuIrFieldu = function(req, res, next) {
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var kiekisStulpeliuIrFieldu = variables.getKiekiStulpeliuIrFieldu(pavadinimasCollection);
  return kiekisStulpeliuIrFieldu;
};

var getDocumentNaujoIraso = function(req, res, next) {
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var kiekisStulpeliuIrFieldu = getKiekiStulpeliuIrFieldu(req, res, next);
  var documentNaujoIraso = {};
  for (var nr = 0; nr < kiekisStulpeliuIrFieldu; nr++) {
    if (variables.getArFiksuojamasStulpelisDuomenuBazeje(pavadinimasCollection, nr)
        && variables.getArRodomasStulpelisLenteleje(pavadinimasCollection, nr)) {
      documentNaujoIraso[variables.getPavadinimaFieldo(pavadinimasCollection, nr)]
          = ( req.body[variables.getPavadinimaFieldo(pavadinimasCollection, nr)] ).trim();
    }
  }
  return documentNaujoIraso;
};


var sukurtiNaujaArbaPakeistiSenaIrasa = function(req, res, next) {

  var objektasKintamuju = {};
  objektasKintamuju.MongoClient = mongodb.MongoClient;
  objektasKintamuju.idIraso = req.params.id || '';
  objektasKintamuju.objektasSort = getObjektaSort(req, res, next, objektasKintamuju);
  objektasKintamuju.pavadinimasPuslapioRenderinamo = getPavadinimaPuslapioRenderinamo(objektasKintamuju);
  objektasKintamuju.objektasQuery = getObjektaQuery(req, res, next, objektasKintamuju);
  objektasKintamuju.pavadinimasCollection = getPavadinimaCollection(req, res, next);
  return objektasKintamuju;

  var MongoClient = mongodb.MongoClient;
  var idIraso = req.params.id || '';
  var documentNaujoIraso = getDocumentNaujoIraso(req, res, next);
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var objektasQuery = getObjektaQueryPagalId(req, res, next);
  var objektasUpdate = { '$set' : documentNaujoIraso };
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      next(variables.getObjektaErrorTechniniaiNesklandumai(err));
    }
    else {
      var collection = db.collection(pavadinimasCollection);
      if (req.params.id) {
        try {
          collection.updateOne(objektasQuery, objektasUpdate, {'upsert' : false},  function(err, result) {
            if (err) {
              next(variables.getObjektaErrorTechniniaiNesklandumai(err));
            }
            else {
              res.redirect(req.baseUrl);
            }
          });
        }
        catch (err) {
          next(variables.getObjektaError404(err));
        }
      }
      else {
        collection.insertOne(documentNaujoIraso, function(err, result) {
          db.close();
          if (err) {
            next(variables.getObjektaErrorTechniniaiNesklandumai(err));
          }
          else {
            res.redirect(req.baseUrl);
          }
        });
      }
    }
  });
};


router.get(variables.pathIndex, function(req, res, next) {
  res.redirect(variables.pathZurnalai);
});

router.get(variables.pathZurnalai, getIrasusIsDbIrAtvaizduotiPuslapyje);

router.delete(variables.pathZurnalai, trintiIrasus);

router.get(variables.pathZurnalasNaujas, function(req, res) {
  res.render('formaIrasoRedagavimo', { 'headeris' : 'Naujas įrašas' } );
});

/* Sitas route handleris kode turi but apacioje nuo visu kitu router.get('/<stringKonstanta>',...);! */
router.get(variables.pathZurnalasAnksciauSukurtas, getIrasusIsDbIrAtvaizduotiPuslapyje);

router.post(variables.pathZurnalasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa);

router.post(variables.pathZurnalasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa);






module.exports = router;