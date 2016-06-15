/*
 Created by gircys on 6/9/2016.
 */

var express = require('express');
var routesForAdmin = express.Router();
var ff = require('../routes/functionsforRouting.js');
var vv = require('../variables.js');



routesForAdmin.get('/', ff.redirectIZurnalai);
routesForAdmin.get(vv.pathZurnalai, ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
routesForAdmin.get(vv.pathZurnalai+'/:id', ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
routesForAdmin.post(vv.pathZurnalai, ff.sukurtiNaujaArbaPakeistiSenaIrasa);




module.exports = routesForAdmin;






