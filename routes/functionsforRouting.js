/*
 Created by gircys on 6/9/2016.
 */

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var validate = require("validate.js");
var vv = require('../variables.js');

/* Caolan's Async library. http://caolan.github.io/async/index.html */
var async = require('async');
var ff = {};


function prisijungtiPrieMongoDb() {
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
}

ff.trintiIrasusAsyncJs = async.waterfall(
    [
    prisijungtiPrieMongoDb  // MongoClient.connect
    , pazymetiIrasusKaipIstrintus // db.collection(pavadinimasCollection).updateMany(
    ]
    , function uzbaigtiTrynimoOperacija() {
        db.close();
        if (err) {
            next(err);
        }
        else {
            res.end('{"success" : "Updated Successfully", "status" : 200}');
        }
    }
);

ff.trintiIrasus = function(req, res, next) {
    console.log('@@@trintiIrasus');
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
        if (err) {
            next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            db.close();
        }
        else {
            var masyvasIdDocumentuPazymetu = req.body.masyvasIdDocumentuPazymetu;
            console.log('@@@@20', masyvasIdDocumentuPazymetu[0], masyvasIdDocumentuPazymetu[1], masyvasIdDocumentuPazymetu[2]);
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
                        next(vv.getObjektaErrorTechniniaiNesklandumai(err));
                        db.close();
                    }
                    else {
                        res.end('{"success" : "Updated Successfully", "status" : 200}');
                        db.close();
                    }
                }
            );
        }
    });
};

ff.getObjektaQueryPagalRaideArbaFraze = function(req, res, next) {
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
        objektasQuery = { '$and' : [vv.$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalRaideArbaFraze] };
        return objektasQuery;
    }
    catch (err) {
        next(vv.getObjektaErrorNegeraPaieskosFraze(err));
    }
};

ff.getObjektaQueryPagalId = function(req, res, next) {
    var objektasQuery;
    var $salygaPaieskosPagalId = { '_id' : new mongodb.ObjectId(req.params.id) };
    objektasQuery = { '$and' : [vv.$salygaPaieskosTikNeistrintuIrasu, $salygaPaieskosPagalId] };
    return objektasQuery;
};

ff.getObjektaQuery = function(req, res, next) {
    var objektasQuery;
    if (req.params.id) {
        try {
            objektasQuery = ff.getObjektaQueryPagalId(req, res, next);
        }
        catch (err) {
            next(vv.getObjektaError404(err));
        }
    }
    else {
        objektasQuery = ff.getObjektaQueryPagalRaideArbaFraze(req, res, next);
    }
    return objektasQuery;
};

ff.getObjektaSort = function(req, res, next) {
    var objektasSort;
    if (req.path == vv.pathZurnalai) {
        objektasSort = {'pavadinimas1':1};
    }
    else if (req.path == vv.pathLeidejai) {
        objektasSort = {'pavadinimas1':1}; // Cia gali keistis stulpelis, pagal kuri sortinam
    }
    else if (req.path == vv.pathDuomenuBazes) {
        objektasSort = {'pavadinimas1':1}; // Cia gali keistis stulpelis, pagal kuri sortinam
    }
    else {
        objektasSort = {};
        // next(vv.getObjektaError404());
    }
    return objektasSort;
};

ff.getPavadinimaPuslapioRenderinamo = function(req, res, next) {
    var pavadinimasPuslapioRenderinamo;
    if (req.params.id) {
        pavadinimasPuslapioRenderinamo = '../views/puslapisIrasuModifikavimo.jade';
    }
    else {
        pavadinimasPuslapioRenderinamo = '../views/puslapisIrasuLenteles.jade';
    }
    return pavadinimasPuslapioRenderinamo;
};

ff.getPavadinimaCollection = function(req, res, next) {
    console.log('@@@139',req.params, req.params.collection);
    var pathCollection = '/'+req.params.collection;
    if (pathCollection == vv.pathZurnalai || pathCollection == vv.pathLeidejai || pathCollection == vv.pathDuomenuBazes) {
        return req.params.collection;
    }
    else {
        // return null;
        next(vv.getObjektaError404());
        // /*
        //  Dizaine nenumatyta kol kas kitokiu base pathu = uzmountintu pathu (per app.use(pathas, ...)
        //  */
        // next(vv.getObjektaErrorTechniniaiNesklandumai());
    }
};


ff.getObjektaKintamujuPerduodamaIJade = function(req, res, next) {
    // var arAdmin = (req.baseUrl == vv.pathAdmin) ? true : false;
    return { 'pp' : {
        'pavadinimasCollection' : ff.getPavadinimaCollection(req, res, next)
        , 'req' : req
        // , 'arAdmin' : arAdmin
        }
    };
};

ff.getIrasusIsDbIrAtvaizduotiPuslapyje = function(req, res, next) {
    console.log('@@@@@156 getIrasusIsDbIrAtvaizduotiPuslapyje');
    console.log('@@@@@', req.params);
    console.log('@@@@@', req.params.id);
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var pavadinimasPuslapioRenderinamo = ff.getPavadinimaPuslapioRenderinamo(req, res, next);
    if (req.params.id != 'naujas') {
        var idIraso = req.params.id || '';
        var objektasSort = ff.getObjektaSort(req, res, next);
        var objektasQuery = ff.getObjektaQuery(req, res, next);
    }
    var collection;
    var objektasKintamujuPerduodamuIJade = ff.getObjektaKintamujuPerduodamaIJade(req, res, next);
    console.log('@@172');
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
        if (err) {
            next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            db.close();
        }
        else {
            if (req.params.id != 'naujas') {
                console.log(JSON.stringify(objektasQuery, null, 2));
                collection = db.collection(pavadinimasCollection);
                collection.find(objektasQuery).sort(objektasSort).toArray(function (err, masyvasIrasu) {
                    if (err) {
                        next(vv.getObjektaErrorTechniniaiNesklandumai(err));
                        db.close();
                    }
                    else if (validate.isEmpty(masyvasIrasu) || !validate.isArray(masyvasIrasu)) {  // Butinai turi but [ ]
                        next(vv.getObjektaError404());
                        db.close();
                    }
                    else if (idIraso) {
                        /* IF perduota f-ja, tai ja vykdyt, ELSE v vykdyt*/
                        objektasKintamujuPerduodamuIJade.pp.headeris = 'Įrašo keitimas';
                        objektasKintamujuPerduodamuIJade.pp.documentIraso = masyvasIrasu[0];



                    }
                    else {
                        objektasKintamujuPerduodamuIJade.pp.headeris = 'Įrašų lentelė';
                        objektasKintamujuPerduodamuIJade.pp.masyvasDocumentu = masyvasIrasu;
                        console.log('@@@@@@186', pavadinimasPuslapioRenderinamo);
                        res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
                        db.close();
                    }
                });
            }
            else if (idIraso == 'naujas') {
                objektasKintamujuPerduodamuIJade.pp.headeris = 'Naujas įrašas';
                console.log('@@@@@@212', pavadinimasPuslapioRenderinamo);

                /* IF perduota funkcija, tai jua vykdyt, ELSE vykdyt v*/

                res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
                // <<<<<<<<<<<
                db.close();
            }
        }
    });
};

ff.atvaizduotiIrasuLentelesPuslapi = function(req, res, next) {
    ff.getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next);
};

ff.atvaizduotiIrasuModifikavimoPuslapi = function(req, res, next) {
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    if (pavadinimasCollection != 'zurnalai') {
        ff.getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next);
    }
    else if (pavadinimasCollection == 'zurnalai') {
        var getSarasaDuombaziuIrLeideju = function(db) {
            var collectionDuombazes = db.collection('duomenu-bazes');
            var collectionLeidejai = db.collection('leidejai');
            var objectasPavadinimuStulpeliuIeskomuDuombaziu = { '_id':true, 'pavadinimas1':true, 'nuoroda':true  };
            var objectasPavadinimuFielduIeskomuLeideju = { '_id':true, 'pavadinimas1':true };
            collectionDuombazes.find(vv.$salygaPaieskosTikNeistrintuIrasu, objectasPavadinimuStulpeliuIeskomuDuombaziu)
                .toArray(function callbackDuombaziuFind (err, masyvasDocumentuDuombaziu) {
                    if ()
                }
            );

        };
        ff.getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next, getSarasaDuombaziuIrLeideju);
    }
};

ff.getKiekiStulpeliuIrFieldu = function(req, res, next) {
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var kiekisStulpeliuIrFieldu = vv.getKiekiStulpeliuIrFieldu(pavadinimasCollection);
    return kiekisStulpeliuIrFieldu;
};

ff.getDocumentIraso = function(req, res, next) {
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    console.log('@@@234',pavadinimasCollection);
    var kiekisStulpeliuIrFieldu = ff.getKiekiStulpeliuIrFieldu(req, res, next);
    console.log('@@@235',kiekisStulpeliuIrFieldu);
    var documentIraso = {};
    console.log('@@@237');
    console.log('@@@243', req.body.documentIraso);
    var documentIrasoIsFrontend = JSON.parse(req.body.documentIraso);
    for (var nr = 0; nr < kiekisStulpeliuIrFieldu; nr++) {
        if (vv.getArFiksuojamasFieldasDuomenuBazeje(pavadinimasCollection, nr)
            && vv.getArRodomasStulpelisLenteleje(pavadinimasCollection, nr)) {
            console.log('@@@242',vv.getPavadinimaFieldo(pavadinimasCollection, nr));
            documentIraso[vv.getPavadinimaFieldo(pavadinimasCollection, nr)]
                = ( documentIrasoIsFrontend[vv.getPavadinimaFieldo(pavadinimasCollection, nr)] ).trim();
                //= ( req.body.documentIraso[vv.getPavadinimaFieldo(pavadinimasCollection, nr)] ).trim();
        }
    }
    return documentIraso;
};


ff.updateSenaIrasa = function(req, res, next) {
    console.log('@@@247 updateNaujaIrasa');
    var objektasQuery = ff.getObjektaQueryPagalId(req, res, next);
    console.log('@@@251');
    var documentIraso = ff.getDocumentIraso(req, res, next);
    console.log('@@@253');
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    console.log('@@@255');
    var objektasUpdate = { '$set' : documentIraso };
    var urlToRedirectAfterSuccess = req.baseUrl+'/'+req.params.collection;
                // if (req.params.id == 'naujas') {
                //
                // }
                // else if (req.params.id != 'naujas') {
                //
                // }
    console.log('@@@260');
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
        if (err) {
            next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            db.close();
        }
        else {
            var collection = db.collection(pavadinimasCollection);
            try {
                collection.updateOne(objektasQuery, objektasUpdate, {'upsert': false}, function (err, result) { //
                    if (err) {
                        next(vv.getObjektaErrorTechniniaiNesklandumai(err));
                    }
                    else {
                        try {
                            var stringJSON = JSON.stringify({"success" : "Updated Successfully", "status" : 200, "url" : urlToRedirectAfterSuccess});
                            res.json(stringJSON);
                        }
                        catch(exception) {
                            next(exception);
                        }
                    }
                    db.close();
                });
            }
            catch (err) {
                db.close();
                next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            }
        }
    });
};

ff.insertNaujaIrasa  = function(req, res, next) {
    console.log('@@@329 insertSenaIrasa');
    console.log('@@@331');
    var documentIraso = ff.getDocumentIraso(req, res, next);
    console.log('@@@332',JSON.stringify(documentIraso));
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var objektasInsert = documentIraso;
    var urlToRedirectAfterSuccess = req.baseUrl+'/'+req.params.collection;
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
        if (err) {
            next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            db.close();
        }
        else {
            var collection = db.collection(pavadinimasCollection);
            try {
                collection.insertOne(objektasInsert, function (err, result) {
                    if (err) {
                        next(vv.getObjektaErrorTechniniaiNesklandumai(err));
                    }
                    else {
                        res.json(JSON.stringify({"success" : "Inserted Successfully", "status" : 200, "url" : urlToRedirectAfterSuccess}));
                    }
                    db.close();
                });
            }
            catch (err) {
                db.close();
                next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            }
        }
    });
};

// ff.pateiktiFormaIrasoRedagavimo = function(req, res, next) {
//     var pavadinimasPuslapioRenderinamo = ff.getPavadinimaPuslapioRenderinamo(req, res, next);
//     var objektasQuery = ff.getObjektaQuery(req, res, next);
//     var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
//     var collectionIrasu;
//     var objektasKintamujuPerduodamuIJade = ff.getObjektaKintamujuPerduodamaIJade(req, res, next);
//
//     // Cia dar reikia pergalvot logika ir paeditint, paadint koda.
//
//     res.render('formaIrasoRedagavimo', { 'headeris' : 'Naujas įrašas' } );
//
//     res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
// };

// ff.getPathBeBaseUrlICollection = function(req, res, next) {
//     if (req.path.length >= vv.pathZurnalai.length) {
//         if (req.path.substring(0, vv.pathZurnalai.length) == vv.pathZurnalai) {
//             return vv.pathZurnalai;
//         }
//     }
//     else if (req.path.length >= vv.pathLeidejai.length) {
//         if (req.path.substring(0, vv.pathLeidejai.length) == vv.pathLeidejai) {
//             return vv.pathLeidejai;
//         }
//     }
//     else if (req.path.length >= vv.pathDuomenuBazes.length) {
//         if (req.path.substring(0, vv.pathDuomenuBazes.length) == vv.pathDuomenuBazes) {
//             return vv.pathDuomenuBazes;
//         }
//     }
// };
//
// ff.getPathSuBaseUrlICollection = function(req, res, next, pathBeBaseUrlICollectionKonkretu) {
//     if (pathBeBaseUrlICollectionKonkretu) {
//         if (req.baseUrl != vv.pathAdmin) {
//             return pathBeBaseUrlICollectionKonkretu;
//         }
//         else if (req.baseUrl == vv.pathAdmin) {
//             return req.baseUrl + pathBeBaseUrlICollectionKonkretu;
//         }
//     }
//     else {
//         if (req.baseUrl != vv.pathAdmin) {
//             return ff.getPathBeBaseUrlICollection(req, res, next);
//         }
//         else if (req.baseUrl == vv.pathAdmin) {
//             return req.baseUrl + ff.getPathBeBaseUrlICollection(req, res, next);
//         }
//     }
// };


ff.redirectIZurnalai = function(req, res, next) {
  res.redirect(req.baseUrl + vv.pathZurnalai);
};


ff.apdorotiLoginAttempt = function(req, res, next) {
    if (req.body.username == 'administrator' && req.body.password == 'MABpcadmin') {
        res.redirect(vv.pathAdmin);
    }
    else {
        res.redirect(vv.pathLoginFailed);
    }
};

ff.atvaizduotiPuslapyjeLoginFailed = function(req, res, next) {
    next(vv.getObjektaErrorNeteisingasPrisijungimas());
};

module.exports = ff;

