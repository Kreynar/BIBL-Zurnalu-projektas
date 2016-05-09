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

var getObjektaSort = function(req, res, next) {
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

var getPavadinimaPuslapioRenderinamo = function(req, res, next) {
  var pavadinimasPuslapioRenderinamo;
  if (req.params.id) {
    pavadinimasPuslapioRenderinamo = '../views/puslapisIrasuModifikavimo.jade';
  }
  else {
    pavadinimasPuslapioRenderinamo = '../views/puslapisIrasuLenteles.jade';
  }
  return pavadinimasPuslapioRenderinamo;
};

var getPavadinimaCollection = function(req, res, next) {
  var pathBeBaseICollection = getPathBeBaseUrlICollection(req, res, next);
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

var getObjektaKintamujuPerduodamaIJade = function(req, res, next) {
  return { 'perduotas' : { 'pavadinimasCollection' : getPavadinimaCollection(req, res, next), 'variables' : variables } };
};

var getIrasusIsDbIrAtvaizduotiPuslapyje = function(req, res, next) {
  console.log('@@@@@156 getIrasusIsDbIrAtvaizduotiPuslapyje');
  var MongoClient = mongodb.MongoClient;
  var idIraso = req.params.id || '';
  var objektasSort = getObjektaSort(req, res, next);
  var pavadinimasPuslapioRenderinamo = getPavadinimaPuslapioRenderinamo(req, res, next);
  var objektasQuery = getObjektaQuery(req, res, next);
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var collectionIrasu;
  var objektasKintamujuPerduodamuIJade = getObjektaKintamujuPerduodamaIJade(req, res, next);
  MongoClient.connect(variables.urlOfDatabase, function(err, db) {
    if (err) {
      next(variables.getObjektaErrorTechniniaiNesklandumai(err));
    }
    else {
      console.log(JSON.stringify(objektasQuery, null, 2));
      collectionIrasu = db.collection(pavadinimasCollection);
      // console.log(JSON.stringify(objektasQuery, null, 4));
      collectionIrasu.find(objektasQuery).sort(objektasSort).toArray(function(err, masyvasIrasu) {
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
          objektasKintamujuPerduodamuIJade.perduotas.headeris = 'Įrašo keitimas';
          objektasKintamujuPerduodamuIJade.perduotas.documentIraso = masyvasIrasu[0];
        }
        else {
          objektasKintamujuPerduodamuIJade.perduotas.masyvasDocumentu = masyvasIrasu;
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
    if (variables.getArFiksuojamasFieldasDuomenuBazeje(pavadinimasCollection, nr)
        && variables.getArRodomasStulpelisLenteleje(pavadinimasCollection, nr)) {
      documentNaujoIraso[variables.getPavadinimaFieldo(pavadinimasCollection, nr)]
          = ( req.body[variables.getPavadinimaFieldo(pavadinimasCollection, nr)] ).trim();
    }
  }
  return documentNaujoIraso;
};


var sukurtiNaujaArbaPakeistiSenaIrasa = function(req, res, next) {
  var MongoClient = mongodb.MongoClient;
  var idIraso = req.params.id || '';
  var documentNaujoIraso = getDocumentNaujoIraso(req, res, next);
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var objektasQuery = getObjektaQueryPagalId(req, res, next);
  var objektasUpdate = { '$set' : documentNaujoIraso };
  var pathSuBaseUrlICollection = getPathSuBaseUrlICollection(req, res, next);
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

var pateiktiFormaIrasoRedagavimo = function(req, res, next) {
  var pavadinimasPuslapioRenderinamo = getPavadinimaPuslapioRenderinamo(req, res, next);
  var objektasQuery = getObjektaQuery(req, res, next);
  var pavadinimasCollection = getPavadinimaCollection(req, res, next);
  var collectionIrasu;
  var objektasKintamujuPerduodamuIJade = getObjektaKintamujuPerduodamaIJade(req, res, next);

  // Cia dar reikia pergalvot logika ir paeditint, paadint koda.

  res.render('formaIrasoRedagavimo', { 'headeris' : 'Naujas įrašas' } );
  
  res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
};

var getPathBeBaseUrlICollection = function(req, res, next) {
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

var getPathSuBaseUrlICollection = function(req, res, next, pathBeBaseUrlICollectionKonkretu) {
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
      return getPathBeBaseUrlICollection(req, res, next);
    }
    else if (req.baseUrl == variables.pathAdmin) {
      return req.baseUrl + getPathBeBaseUrlICollection(req, res, next);
    }
  }
};

var redirectIndexIZurnalai = function(req, res, next) {
  console.log('@@@@@316 redirectIndexIZurnalai');
  /*
   Patikrina, ar HTTP request path'o tik pradzia lygi variables.pathIndex, ar visas request path'as lygus variables.pathIndex.
   */
  var pathSuBaseUrlIZurnalai = getPathSuBaseUrlICollection(req, res, next, variables.pathZurnalai);
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


var apdorotiLoginAttempt = function(req, res, next) {
  if (req.body.username == 'administrator' && req.body.password == 'MABpcadmin') {
    res.redirect(variables.pathAdmin);
  }
  else {
    res.redirect(variables.pathLoginFailed);
  }
};

var atvaizduotiPuslapyjeLoginFailed = function(req, res, next) {
  next(variables.getObjektaErrorNeteisingasPrisijungimas());
};


router.get(variables.pathIndex, redirectIndexIZurnalai);
router.get(variables.pathZurnalai, getIrasusIsDbIrAtvaizduotiPuslapyje);

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