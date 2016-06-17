/*
 Created by gircys on 6/9/2016.
 */

var mongodb = require('mongodb');
var vv = require('../variables.js');
var ff = {};



ff.trintiIrasus = function(req, res, next) {
    console.log('@@@trintiIrasus');
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
        if (err) {
            next(vv.getObjektaErrorTechniniaiNesklandumai(err));
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
                        res.send({ 'statusas' : 'ok' });
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
    var MongoClient = mongodb.MongoClient;
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
        }
        else {
            if (req.params.id != 'naujas') {
                console.log(JSON.stringify(objektasQuery, null, 2));
                collection = db.collection(pavadinimasCollection);
                collection.find(objektasQuery).sort(objektasSort).toArray(function (err, masyvasIrasu) {
                    if (err) {
                        next(vv.getObjektaErrorTechniniaiNesklandumai(err));
                    }
                    else if (idIraso) {
                        if (!masyvasIrasu) {
                            next(vv.getObjektaError404());
                        }
                        else if (masyvasIrasu.length == 0) {
                            next(vv.getObjektaError404());
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
                    db.close(function () {
                        console.log('Tiketina, kad ivykdyta db.close()')
                    });
                });
            }
            if (req.params.id == 'naujas') {
                objektasKintamujuPerduodamuIJade.pp.headeris = 'Naujas įrašas';
                console.log('@@@@@@212', pavadinimasPuslapioRenderinamo);
                res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
                // <<<<<<<<<<<
                db.close(function () {
                    console.log('Tiketina, kad ivykdyta db.close()')
                });
            }
        }
    });
};

ff.getKiekiStulpeliuIrFieldu = function(req, res, next) {
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var kiekisStulpeliuIrFieldu = vv.getKiekiStulpeliuIrFieldu(pavadinimasCollection);
    return kiekisStulpeliuIrFieldu;
};

ff.getDocumentIraso = function(req, res, next) {
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var kiekisStulpeliuIrFieldu = ff.getKiekiStulpeliuIrFieldu(req, res, next);
    var documentIraso = {};
    for (var nr = 0; nr < kiekisStulpeliuIrFieldu; nr++) {
        if (vv.getArFiksuojamasFieldasDuomenuBazeje(pavadinimasCollection, nr)
            && vv.getArRodomasStulpelisLenteleje(pavadinimasCollection, nr)) {
            documentIraso[vv.getPavadinimaFieldo(pavadinimasCollection, nr)]
                = ( req.body[vv.getPavadinimaFieldo(pavadinimasCollection, nr)] ).trim();
        }
    }
    return documentIraso;
};


ff.sukurtiNaujaArbaPakeistiSenaIrasa = function(req, res, next) {
    console.log('@@@sukurtiNaujaArbaPakeistiSenaIrasa');
    var MongoClient = mongodb.MongoClient;
    var objektasQuery = ff.getObjektaQueryPagalId(req, res, next);
    var documentIraso = ff.getDocumentIraso(req, res, next);
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var objektasUpdate = { '$set' : documentIraso };
                // if (req.params.id == 'naujas') {
                //
                // }
                // else if (req.params.id != 'naujas') {
                //
                // }
    MongoClient.connect(vv.urlOfDatabase, function(err, db) {
        if (err) {
            next(vv.getObjektaErrorTechniniaiNesklandumai(err));
        }
        else {
            var collection = db.collection(pavadinimasCollection);
            try {
                collection.updateOne(objektasQuery, objektasUpdate, {'upsert': true}, function (err, result) {
                    if (err) {
                        next(vv.getObjektaErrorTechniniaiNesklandumai(err));
                    }
                    else {
                        res.redirect(req.baseUrl + '/' + pavadinimasCollection);
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

            //
            //
            //             var idIraso = req.params.id || '';
            //             var documentNaujoIraso = ff.getDocumentIraso(req, res, next);
            //             var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
            //             var objektasQuery = ff.getObjektaQueryPagalId(req, res, next);
            //             var objektasUpdate = { '$set' : documentNaujoIraso };
            //             var pathSuBaseUrlICollection = ff.getPathSuBaseUrlICollection(req, res, next);
            // //-------
            // MongoClient.connect(vv.urlOfDatabase, function(err, db) {
            //     if (err) {
            //         next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            //     }
            //     else {
            //         var collection = db.collection(pavadinimasCollection);
            //         if (idIraso) {
            //             try {
            //                 collection.updateOne(objektasQuery, objektasUpdate, {'upsert' : false},  function(err, result) {
            //                     if (err) {
            //                         next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            //                     }
            //                     else {
            //                         res.redirect(pathSuBaseUrlICollection);
            //                     }
            //                 });
            //             }
            //             catch (err) {
            //                 next(vv.getObjektaError404(err));
            //             }
            //         }
            //         else {
            //             collection.insertOne(documentNaujoIraso, function(err, result) {
            //                 db.close();
            //                 if (err) {
            //                     next(vv.getObjektaErrorTechniniaiNesklandumai(err));
            //                 }
            //                 else {
            //                     res.redirect(pathSuBaseUrlICollection);
            //                 }
            //             });
            //         }
            //     }
            // });
};

ff.pateiktiFormaIrasoRedagavimo = function(req, res, next) {
    var pavadinimasPuslapioRenderinamo = ff.getPavadinimaPuslapioRenderinamo(req, res, next);
    var objektasQuery = ff.getObjektaQuery(req, res, next);
    var pavadinimasCollection = ff.getPavadinimaCollection(req, res, next);
    var collectionIrasu;
    var objektasKintamujuPerduodamuIJade = ff.getObjektaKintamujuPerduodamaIJade(req, res, next);

    // Cia dar reikia pergalvot logika ir paeditint, paadint koda.

    res.render('formaIrasoRedagavimo', { 'headeris' : 'Naujas įrašas' } );

    res.render(pavadinimasPuslapioRenderinamo, objektasKintamujuPerduodamuIJade);
};

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

