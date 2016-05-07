/**
 * Created by Martynas on 5/6/2016.
 */

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var variables = require('../variables.js');





router.get(variables.pathLeidejai, getLeidejusIsDbIrAtvaizduotiPuslapyje);

router.delete(variables.pathLeidejai, trintiLeidejus); // trintiLeidejus ??????????????????????????????????

router.get(variables.pathLeidejasNaujas, function(req, res) {
    res.render('formaRedagavimo', { 'headeris' : 'Naujas įrašas' } ); // formaRedagavimo????????????????????????
});

/* Sitas route handleris kode turi but apacioje nuo visu kitu router.get('/<stringKonstanta>',...);! */
router.get(variables.pathLeidejasAnksciauSukurtas, getIrasusIsDbIrAtvaizduotiPuslapyje);

router.post(variables.pathLeidejasNaujas, sukurtiNaujaArbaPakeistiSenaIrasa);

router.post(variables.pathLeidejasAnksciauSukurtas, sukurtiNaujaArbaPakeistiSenaIrasa);
















