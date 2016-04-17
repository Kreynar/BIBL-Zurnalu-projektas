/**
 * Created by Martynas on 4/11/2016.
 */

var app = require('../app');

console.log('@@@@@@@7' + app.locals);
// app.locals.pavadinimasSvetaines = 'Lietuvos mokslo žurnalų sąrašas';

/*
 Sito masyvo elementu pavadinimus gali tekti pakeisti, jei keisis duomenu bazeje
 field'u pavadinimai (arba bus nauju fieldu, kuriuos reikes atvaizduoti
 lenteleje)!!!!!!!!!!!!!!!!!!!!
 */
// var masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu = [
//
//     /*
//      <fieldoPavadinimasDuombazeje>       <stulpelioPavadinimasLentelejeSvetaineje>
//      */
//     [null,                                    'Checkbox']
//     ,['_id',                                  'ID']
//     ,['aristrintas',                          'Ar istrintas']
//     ,[null,                                   'Nr.']                        // 0
//     ,['pavadinimas1',                         'Pavadinimas']                // 1
//     ,['pavadinimas2',                         'Kitas pavadinimas']         // 2
//     ,['issn',                                 'ISSN']                      // 3
//     ,['leidejas',                             'Leidėjas']                  // 4
//     ,['db',                                   'Duomenų bazė']              // 5
//     ,['pastabos',                             'Pastabos']                   // 6
// ];



var metadataStulpeliuIrFieldu = {

    /*
    <aliasStulpelioArbaFieldo>     <arRodytLentelej> <arFiksuojamaDb> <pavadinimasStulpelio> <pavadinimasFieldo>
     */
    checkboxTrynimoIrKeitimo :     [true,                 false,         '',                        '']
    , id :                         [false,                true,          '',                        '_id']
    , arIstrintas :                [false,                true,          '',                       'aristrintas']
    , nr :                         [true,                 false,         'Nr.',                     '']
    , pavadinimas1 :               [true,                 true,          'Pavadinimas',            'pavadinimas1']
    , pavadinimas2 :               [true,                 true,          'Kitas pavadinimas',      'pavadinimas2']
    , issn :                       [true,                 true,          'ISSN',                    'issn']
    , leidejas :                   [true,                 true,          'Leidėjas',               'leidejas']
    , db :                         [true,                 true,          'Duomenų bazė(-ės)',      'db']
    , pastabos :                   [true,                 true,          'Pastabos',               'pastabos']

};


module.exports = ({ 

    /*
     Duomenu bazes adresas.
     */
    urlOfDatabase : 'mongodb://localhost:27017/mongoDBZurnaluProjekto',

    getPavadinimaStulpelio : function (aliasArbaNumerisStulpelioArbaFieldo) {
        if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
            return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][2];
        }
        else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
            return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][2];
        }
    },

    getPavadinimaFieldo : function (aliasArbaNumerisStulpelioArbaFieldo) {
        if (typeof aliasArbaNumerisStulpelioArbaFieldo === 'string') {
            return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][3];
        }
        else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
            return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][3];
        }
        else {

        }
    },

    getAliasStulpelioArbaFieldo : function (numerisStulpelioArbaFieldo) {
        return Object.keys(metadataStulpeliuIrFieldu)[numerisStulpelioArbaFieldo];
    },

    getArRodytiStulpeliLenteleje : function (aliasArbaNumerisStulpelioArbaFieldo) {
        if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
            return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][0];
        }
        else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
            return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][0];
        }
    },

    kiekisStulpeliuArbaFieldu : Object.keys(metadataStulpeliuIrFieldu).length,

    pavadinimasSvetaines : 'Lietuvos mokslo žurnalų sąrašas',

    pristatymasSvetaines : 'Sveiki atvykę į Lietuvos mokslo žurnalų internetinę svetainę!' +
        ' Čia galite rasti visų mokslo bendruomenės žurnalų sąrašą bei sužinoti, kokiose duomenų' +
        ' bazėse talpinamas pilnas šių žurnalų turinys.',

    masyvasRaidziuAbecelesLietuviskos : [
        'A', 'Ą', 'B', 'C', 'Č', 'D', 'E', 'Ę', 'Ė', 'F'
        , 'G', 'H', 'I', 'Į', 'Y', 'J', 'K', 'L', 'M'
        , 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ų', 'Ū', 'V', 'Z', 'Ž'
    ]

    , pathPaiesku : '/ieskoti'

    , parametrasQueryPaieskuPagalRegex : 'regex'
    
    , pranesimas404 : 'Ieškomas puslapis nerastas'

    , pranesimasFrazePaieskosNegera : 'Įvyko klaida. Pamėginkite pakeisti paieškos frazę.'


    , inicializuotiObjekta : function() {

        this.pathIrQueryPaieskuPagalRegexBeReiksmesParametro = this.pathPaiesku + '?' + this.parametrasQueryPaieskuPagalRegex + '=';

        this.Autolinker = require( 'autolinker' );

        this.kiekisStulpeliuRodomu = function () {
            var kiekisStulpeliuRodomu = 0;
            for (var aliasStulpelioArbaFieldo in metadataStulpeliuIrFieldu) {
                if (this.getArRodytiStulpeliLenteleje(metadataStulpeliuIrFieldu[aliasStulpelioArbaFieldo])) {
                    kiekisStulpeliuRodomu++;
                }
            }
            return kiekisStulpeliuRodomu;
        };

        return this;
    }

}).inicializuotiObjekta();



 











