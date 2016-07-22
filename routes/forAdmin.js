/*
 Created by gircys on 6/9/2016.
 */

var express = require('express');
var routesForAdmin = express.Router();
var ff = require('../routes/functionsforRouting.js');
var vv = require('../variables.js');



routesForAdmin.get('/', ff.redirectIZurnalai);

routesForAdmin.get('/:collection', ff.atvaizduotiIrasuLentelesPuslapi);
routesForAdmin.get('/:collection'+'/:id', ff.atvaizduotiIrasuModifikavimoPuslapi);
routesForAdmin.post('/:collection', ff.insertNaujaIrasa); /* POST /collection = INSERT nauja irasa i DB*/
routesForAdmin.put('/:collection'+'/:id', ff.updateSenaIrasa); /* PUT /collection/<id> = UPDATE sena irasa DB*/
routesForAdmin.delete('/:collection', ff.trintiIrasus);



// routesForAdmin.get(vv.pathZurnalai, ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
// routesForAdmin.get(vv.pathZurnalai+'/:id', ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
// routesForAdmin.post(vv.pathZurnalai, ff.insertNaujaIrasa);
// routesForAdmin.delete(vv.pathZurnalai, ff.trintiIrasus);
//
// routesForAdmin.get(vv.pathLeidejai, ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
// routesForAdmin.get(vv.pathLeidejai+'/:id', ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
//
// routesForAdmin.get(vv.pathDuomenuBazes, ff.getIrasusIsDbIrAtvaizduotiPuslapyje);

module.exports = routesForAdmin;






