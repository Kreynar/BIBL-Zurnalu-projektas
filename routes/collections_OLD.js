var express = require('express');
var router = express.Router();
var ff = require('functionsforRouting.js');
var vv = require('../variables.js');

            // router.get(vv.pathIndex, router.redirectIndexIZurnalai);
            // router.get(vv.pathZurnalai, router.getIrasusIsDbIrAtvaizduotiPuslapyje);


            // router.use('/:admin', function(req, res, next) {
            //   if ('/'+req.params.admin == vv.pathAdmin) {
            //     req.baseUrl =
            //   }
            // });

            // router.use('/:*', function(req, res, next){
            //   console.log('@@@361', req.params[0]);
            // });
            //
            // router.use('/:a', function(req, res, next){
            //   console.log('@@@365', req.params.a);
            // });

            // router.use(vv.pathAdmin, function(req, res, next) {
            //   console.log('@@@375',req.baseUrl);
            //   //req.baseUrl = vv.pathAdmin;    NEREIK SITO NET
            //   console.log('@@@377',req.baseUrl);
            //   console.log('@@@@378',req.url);
            //   console.log('@@@@379',req.originalUrl);
            //   console.log('@@@@380',req.path);
            //   console.log('@@@@381',req.route);
            //   console.log('@@@@382',req.params[0]);
            //   next();
            // });

            // router.use('/:a', function(req, res, next){
            //   // req.url = 'a';
            //   // req.originalUrl = 'b';
            //   // req.path = 'c';
            //   // req.route = 'd';
            //   // req.params[0] = 'e';
            //   // req.baseUrl = 'f';
            //   req.baseUrl = 'aa';
            //   console.log('@@@@@387',req.url);
            //   console.log('@@@@@388',req.originalUrl);
            //   console.log('@@@@@389',req.path);
            //   console.log('@@@@@390',req.route);
            //   console.log('@@@@@391',req.params[0]);
            //   console.log('@@@369', req.baseUrl);
            //   next();
            // });
            //
            // router.use('/', function(req, res, next){
            //   console.log('@@@@@403',req.url);
            //   console.log('@@@@@404',req.originalUrl);
            //   console.log('@@@@@405',req.path);
            //   console.log('@@@@@406',req.route);
            //   console.log('@@@@@407',req.params[0]);
            //   console.log('@@@408', req.baseUrl);
            // });
            //
            // // router.use('/', function(req, res, next){
            // //   console.log('@@@369');
            // // });






router.use('/', function(req, res, next) {



  /* Login sistema is bedos laikina >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  if (req.baseUrl == vv.pathLogin) {

    console.log('@@@@351');
    router.use(apdorotiLoginAttempt(req, res, next));

  }

  else if (req.baseUrl == vv.pathLoginFailed) {
    console.log('@@@@355');
    router.use(atvaizduotiPuslapyjeLoginFailed(req, res, next));
  }
  /* Login sistema is bedos laikina <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

          else if (req.baseUrl != vv.pathAdmin) {
            console.log('@@@@361');
            // router.get(vv.pathIndex, function(req, res, next) {
            //   console.log('@@@@@@370');
            // });
            router.get(vv.pathIndex, redirectIndexIZurnalai(req, res, next));
            router.get(vv.pathZurnalai, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
          }
  else if (req.baseUrl == vv.pathAdmin) {
    console.log('@@@@366');

    /* '/' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
    router.get(vv.pathIndex, redirectIndexIZurnalai(req, res, next));

    /* '/zurnalai' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
    router.get(vv.pathZurnalai, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
    router.delete(vv.pathZurnalai, trintiIrasus(req, res, next));
    router.get(vv.pathZurnalasNaujas, pateiktiFormaIrasoRedagavimo(req, res, next));
    router.get(vv.pathZurnalasAnksciauSukurtas, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
    router.post(vv.pathZurnalasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
    router.post(vv.pathZurnalasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));

    /* '/leidejai' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
    router.get(vv.pathLeidejai, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
    router.delete(vv.pathLeidejai, trintiIrasus(req, res, next));
    router.get(vv.pathLeidejasNaujas, pateiktiFormaIrasoRedagavimo(req, res, next));
    router.get(vv.pathLeidejasAnksciauSukurtas, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
    router.post(vv.pathLeidejasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
    router.post(vv.pathLeidejasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));

    /* '/duomenu-bazes' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
    router.get(vv.pathDuomenuBazes, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
    router.delete(vv.pathDuomenuBazes, trintiIrasus(req, res, next));
    router.get(vv.pathDuomenuBazeNauja, pateiktiFormaIrasoRedagavimo(req, res, next));
    router.get(vv.pathDuomenuBazeAnksciauSukurta, getIrasusIsDbIrAtvaizduotiPuslapyje(req, res, next));
    router.post(vv.pathDuomenuBazeNauja, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
    router.post(vv.pathDuomenuBazeAnksciauSukurta, sukurtiNaujaArbaPakeistiSenaIrasa(req, res, next));
  }
});







module.exports = router;