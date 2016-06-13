/*
 Created by gircys on 6/9/2016.
 */

var express = require('express');
var routesForUser = express.Router();
var ff = require('../routes/functionsForRouting.js');
var vv = require('../variables.js');



/* Useriu (ne Admin) route handlinimas  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
routesForUser.get(vv.pathZurnalai, ff.getIrasusIsDbIrAtvaizduotiPuslapyje);
routesForUser.get('/*', ff.redirectIZurnalaiUseri);

/* Useriu (ne Admin) route handlinimas  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


module.exports = routesForUser;

