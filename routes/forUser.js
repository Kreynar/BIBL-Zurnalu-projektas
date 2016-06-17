/*
 Created by gircys on 6/9/2016.
 */

var express = require('express');
var routesForUser = express.Router();
var ff = require('../routes/functionsforRouting.js');
var vv = require('../variables.js');



/* Useriu (ne Admin) route handlinimas  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
routesForUser.get('/', ff.redirectIZurnalai);
routesForUser.get('/:collection', ff.getIrasusIsDbIrAtvaizduotiPuslapyje);


/* Useriu (ne Admin) route handlinimas  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


module.exports = routesForUser;

