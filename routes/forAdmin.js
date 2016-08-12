/*
 Created by gircys on 6/9/2016.
 */

var express = require('express');
var routesForAdmin = express.Router();
var ff = require('../routes/functionsforRouting.js');
var vv = require('../variables.js');


/*
 GET    /<collection>
 */
routesForAdmin.get('/', ff.redirectIZurnalai);

/*
 GET    /<collection>
 GET    /<collection>?raide=<raide>
 GET    /<collection>?fraze=<fraze>
 */
routesForAdmin.get('/:collection', ff.pateiktiPuslapiIrasuSarasoLenteles);

/*
 GET    /<collection>/naujas
 GET    /<collection>/<id>
 */
routesForAdmin.get('/:collection'+'/:id', ff.pateiktiPuslapiModifikavimoIraso);

/*
POST    /<collection>               = INSERT nauja irasa i DB
 */
routesForAdmin.post('/:collection', ff.insertNaujaIrasa);

/*
 PUT    /<collection>/<id>            = UPDATE sena irasa DB
 */
routesForAdmin.put('/:collection'+'/:id', ff.updateSenaIrasa);

/*
 DELETE /<collection>                 gaunamas norimu trint sarasas in Ajax bodyje
 */
routesForAdmin.delete('/:collection', ff.trintiIrasusAsyncJs);



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






