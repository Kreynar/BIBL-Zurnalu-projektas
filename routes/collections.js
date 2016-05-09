var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var variables = require('../variables.js');



router.trintiIrasus = function(req, res, next) {
  var pavadinimasCollection = router.getPavadinimaCollection(req, res, next);
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

router.getObjektaQueryPagalRaideArbaFraze = function(req, res, next) {
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

router.getObjektaQueryPagalId = function(req, res, next) {
  var objektasQuery;
  var $salygaPaieskosPagalId = { '_id' : new mongodb.ObjectId(req.params.id) };
  objektasQuery = { '$and' : [variables.$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalId] };
  return objektasQuery;
};

router.getObjektaQuery = function(req, res, next) {
  var objektasQuery;
  if (req.params.id) {
    try {
      objektasQuery = router.getObjektaQueryPagalId(req.params.id);
    }
    catch (err) {
      next(variables.getObjektaError404(err));
    }
  }
  else {
    objektasQuery = router.getObjektaQueryPagalRaideArbaFraze(req, res, next);
  }
  return objektasQuery;
};

router.getObjektaSort = function(req, res, next) {
  var objektasSort;
  if (req.path == variables.pathZurnalai) {
    objektasSort = {'pavadinimas1':1};
  }
  else if (req.path == variables.pathLeidejai) {
    objektasSort = {'pavadinimas1':1}; // Cia gali keistis stulpelis, pagal kuri sortinam
  }
  else if (req.path == variables.pathDuomenuBazes) {
    objektasSort = {'pavadinimas1':1}; // Cia gali keistis stulpelis, pagal kuri sortinam
  }
  else {
    next(variables.getObjektaError404());
  }
  return objektasSort;
};

router.getPavadinimaPuslapioRenderinamo = function(req, res, next) {
  var pavadinimasPuslapioRenderinamo;
  if (req.params.id) {
    pavadinimasPuslapioRenderinamo = '../views/puslapisIrasuModifikavimo.jade';
  }
  else {
    pavadinimasPuslapioRenderinamo = '../views/puslapisIrasuLenteles.jade';
  }
  return pavadinimasPuslapioRenderinamo;
};

router.getPavadinimaCollection = function(req, res, next) {
  var pathBeBaseICollection = router.getPathBeBaseUrlICollection(req, res, next);
  if (pathBeBaseICollection == variables.pathZurnalai) {
    return 'zurnalai';
  }
  else if (pathBeBaseICollection == variables.pathLeidejai) {
    return 'leidejai';
  }
  else if (pathBeBaseICollection == variables.pathDuomenuBazes) {
    return 'duomenubazes';
  }
  else {
    
    /*
    Dizaine nenumatyta kol kas kitokiu base pathu = uzmountintu pathu (per app.use(pathas, ...)
     */
    next(variables.getObjektaErrorTechniniaiNesklandumai());
  }
};

router.getObjektaKintamujuPerduodamaIJade = function(req, res, next) {
  var arAdmin = (req.baseUrl == variables.pathAdmin) ? true : false;
  return { 'pp' : {
                  'pavadinimasCollection' : getPavadinimaCollection(req, res, next)
                  , 'arAdmin' : arAdmin } };
};

router.getObjektaKintamujuPerduodamaIJade = function(req, res, next) {
  var arAdmin = (req.baseUrl == variables.pathAdmin) ? true : false;
  return { 'pp' : {
    'pavadinimasCollection' : router.getPavadinimaCollection(req, res, next)
    , 'arAdmin' : arAdmin } };
};

router.getIrasusIsDbIrAtvaizduotiPuslapyje = function(req, res, next) {
  console.log('@@@@@156 getIrasusIsDbIrAtvaizduotiPuslapyje');
  var MongoClient = mongodb.MongoClient;
  var idIraso = req.params.id || '';
  var objektasSort = router.getObjektaSort(req, res, next);
  var pavadinimasPuslapioRenderinamo = router.getPavadinimaPuslapioRenderinamo(req, res, next);
  var objektasQuery = router.getObjektaQuery(req, res, next);
  var pavadinimasCollection = router.getPavadinimaCollection(req, res, next);
  var collection;
  var objektasKintamujuPerduodamuIJade = router.getObjektaKintamujuPerduodamaIJade(req, res, next);
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      next(variables.getObjektaErrorTechniniaiNesklandumai(err));
    }
    else {
      console.log(JSON.stringify(objektasQuery, null, 2));
      collection = db.collection(pavadinimasCollection);
      // console.log(JSON.stringify(objektasQuery, null, 4));
      collection.find(objektasQuery).sort(objektasSort).toArray(function(err, masyvasIrasu) {
        if (err) {
          next(variables.getObjektaErrorTechniniaiNesklandumai(err));
        }
        else if (idIraso) {
          if (!masyvasIrasu) {
            next(variables.getObjektaError404());
          }
          else if (masyvasIrasu.length == 0) {
            next(variables.getObjektaError404());
          }
          objektasKintamujuPerduodamuIJade.pp.headeris = 'Įrašo keitimas';
          objektasKintamujuPerduodamuIJade.pp.documentIraso = masyvasIrasu[0];
        }
        else {
          objektasKintamujuPerduodamuIJade.pp.masyvasDocumentu = masyvasIrasu;
        }
        console.log('@@@@@@186', pavadinimasPuslapioRenderinamo);
        res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
        // <<<<<<<<<<<
        db.close(function() {
          console.log('Tiketina, kad ivykdyta db.close()')
        });
      });
    }
  });
};

router.getKiekiStulpeliuIrFieldu = function(req, res, next) {
  var pavadinimasCollection = router.getPavadinimaCollection(req, res, next);
  var kiekisStulpeliuIrFieldu = variables.getKiekiStulpeliuIrFieldu(pavadinimasCollection);
  return kiekisStulpeliuIrFieldu;
};

router.getDocumentNaujoIraso = function(req, res, next) {
  var pavadinimasCollection = router.getPavadinimaCollection(req, res, next);
  var kiekisStulpeliuIrFieldu = router.getKiekiStulpeliuIrFieldu(req, res, next);
  var documentNaujoIraso = {};
  for (var nr = 0; nr < kiekisStulpeliuIrFieldu; nr++) {
    if (variables.getArFiksuojamasFieldasDuomenuBazeje(pavadinimasCollection, nr)
        && variables.getArRodomasStulpelisLenteleje(pavadinimasCollection, nr)) {
      documentNaujoIraso[variables.getPavadinimaFieldo(pavadinimasCollection, nr)]
          = ( req.body[variables.getPavadinimaFieldo(pavadinimasCollection, nr)] ).trim();
    }
  }
  return documentNaujoIraso;
};


router.sukurtiNaujaArbaPakeistiSenaIrasa = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var idIraso = req.params.id || '';
  var documentNaujoIraso = router.getDocumentNaujoIraso(req, res, next);
  var pavadinimasCollection = router.getPavadinimaCollection(req, res, next);
  var objektasQuery = router.getObjektaQueryPagalId(req, res, next);
  var objektasUpdate = { '$set' : documentNaujoIraso };
  var pathSuBaseUrlICollection = router.getPathSuBaseUrlICollection(req, res, next);
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      next(variables.getObjektaErrorTechniniaiNesklandumai(err));
    }
    else {
      var collection = db.collection(pavadinimasCollection);
      if (idIraso) {
        try {
          collection.updateOne(objektasQuery, objektasUpdate, {'upsert' : false},  function(err, result) {
            if (err) {
              next(variables.getObjektaErrorTechniniaiNesklandumai(err));
            }
            else {
              res.redirect(pathSuBaseUrlICollection);
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
            res.redirect(pathSuBaseUrlICollection);
          }
        });
      }
    }
  });
};

router.pateiktiFormaIrasoRedagavimo = function(req, res, next) {
  var pavadinimasPuslapioRenderinamo = router.getPavadinimaPuslapioRenderinamo(req, res, next);
  var objektasQuery = router.getObjektaQuery(req, res, next);
  var pavadinimasCollection = router.getPavadinimaCollection(req, res, next);
  var collectionIrasu;  
  var objektasKintamujuPerduodamuIJade = router.getObjektaKintamujuPerduodamaIJade(req, res, next);

  // Cia dar reikia pergalvot logika ir paeditint, paadint koda.

  res.render('formaIrasoRedagavimo', { 'headeris' : 'Naujas įrašas' } );
  
  res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
};

router.getPathBeBaseUrlICollection = function(req, res, next) {
  if (req.path.length >= variables.pathZurnalai.length) {
    if (req.path.substring(0, variables.pathZurnalai.length) == variables.pathZurnalai) {
      return variables.pathZurnalai;
    }
  }
  else if (req.path.length >= variables.pathLeidejai.length) {
    if (req.path.substring(0, variables.pathLeidejai.length) == variables.pathLeidejai) {
      return variables.pathLeidejai;
    }
  }
  else if (req.path.length >= variables.pathDuomenuBazes.length) {
    if (req.path.substring(0, variables.pathDuomenuBazes.length) == variables.pathDuomenuBazes) {
      return variables.pathDuomenuBazes;
    }
  }
};

router.getPathSuBaseUrlICollection = function(req, res, next, pathBeBaseUrlICollectionKonkretu) {
  if (pathBeBaseUrlICollectionKonkretu) {
    if (req.baseUrl != variables.pathAdmin) {
      return pathBeBaseUrlICollectionKonkretu;
    }
    else if (req.baseUrl == variables.pathAdmin) {
      return req.baseUrl + pathBeBaseUrlICollectionKonkretu;
    }
  }
  else {
    if (req.baseUrl != variables.pathAdmin) {
      return router.getPathBeBaseUrlICollection(req, res, next);
    }
    else if (req.baseUrl == variables.pathAdmin) {
      return req.baseUrl + router.getPathBeBaseUrlICollection(req, res, next);
    }
  }
};

router.redirectIndexIZurnalai = function(req, res, next) {
  console.log('@@@@@316 redirectIndexIZurnalai');
  /*
   Patikrina, ar HTTP request path'o tik pradzia lygi variables.pathIndex, ar visas request path'as lygus variables.pathIndex.
   */
  var pathSuBaseUrlIZurnalai = router.getPathSuBaseUrlICollection(req, res, next, variables.pathZurnalai);
  // console.log('@@@@@321', pathSuBaseUrlIZurnalai);
  console.log('@@@@@321');
  if (req.path == variables.pathIndex) {
    console.log('@@@@@324 res.redirect(variables.pathZurnalai);');
    res.redirect(pathSuBaseUrlIZurnalai);
    // res.send('Indexx');
    // res.redirect(variables.pathZurnalai);
  }
  else {
    console.log('@@@@@329');
    next();
  }
};


router.apdorotiLoginAttempt = function(req, res, next) {
  if (req.body.username == 'administrator' && req.body.password == 'MABpcadmin') {
    res.redirect(variables.pathAdmin);
  }
  else {
    res.redirect(variables.pathLoginFailed);
  }
};

router.atvaizduotiPuslapyjeLoginFailed = function(req, res, next) {
  next(variables.getObjektaErrorNeteisingasPrisijungimas());
};


router.get(variables.pathIndex, router.redirectIndexIZurnalai);
router.get(variables.pathZurnalai, router.getIrasusIsDbIrAtvaizduotiPuslapyje);

// router.use('/', function(req, res, next) {
//   console.log('@@@@348');
//
//   /* Login sistema is bedos laikina >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
//   if (req.baseUrl == variables.pathLogin) {
//
//     console.log('@@@@351');
//     router.use(apdorotiLoginAttempt(req, res, next));
//
//   }
//
//   else if (req.baseUrl == variables.pathLoginFailed) {
//     console.log('@@@@355');
//     router.use(atvaizduotiPuslapyjeLoginFailed(req, res, next));
//   }
//   /* Login sistema is bedos laikina <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
//
//   else if (req.baseUrl != variables.pathAdmin) {
//     console.log('@@@@361');
//     // router.get(variables.pathIndex, function(req, res, next) {
//     //   console.log('@@@@@@370');
//     // });
//     router.get(variables.pathIndex, redirectIndexIZurnalai(req, res, next));
//     router.get(variables.pathZurnalai, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//   }
//   else if (req.baseUrl == variables.pathAdmin) {
//     console.log('@@@@366');
//
//     /* '/' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
//     router.get(variables.pathIndex, redirectIndexIZurnalai(req, res, next));
//
//     /* '/zurnalai' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
//     router.get(variables.pathZurnalai, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//     router.delete(variables.pathZurnalai, trintiIrasus(req, res, next));
//     router.get(variables.pathZurnalasNaujas, pateiktiFormaIrasoRedagavimo(req, res, next));
//     router.get(variables.pathZurnalasAnksciauSukurtas, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//     router.post(variables.pathZurnalasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
//     router.post(variables.pathZurnalasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
//
//     /* '/leidejai' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
//     router.get(variables.pathLeidejai, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//     router.delete(variables.pathLeidejai, trintiIrasus(req, res, next));
//     router.get(variables.pathLeidejasNaujas, pateiktiFormaIrasoRedagavimo(req, res, next));
//     router.get(variables.pathLeidejasAnksciauSukurtas, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//     router.post(variables.pathLeidejasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
//     router.post(variables.pathLeidejasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
//
//     /* '/duomenu-bazes' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
//     router.get(variables.pathDuomenuBazes, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//     router.delete(variables.pathDuomenuBazes, trintiIrasus(req, res, next));
//     router.get(variables.pathDuomenuBazeNauja, pateiktiFormaIrasoRedagavimo(req, res, next));
//     router.get(variables.pathDuomenuBazeAnksciauSukurta, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
//     router.post(variables.pathDuomenuBazeNauja, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
//     router.post(variables.pathDuomenuBazeAnksciauSukurta, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
//   } 
// });







module.exports = router;