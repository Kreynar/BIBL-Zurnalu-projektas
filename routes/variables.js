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
var masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu = [

    /*
     <fieldoPavadinimasDuombazeje>       <stulpelioPavadinimasLentelejeSvetaineje>
     */
    [null, 'Nr.'],                       // 0
    ['pavadinimas1', 'Pavadinimas'],                // 1
    ['pavadinimas2', 'Kitas pavadinimas'],         // 2
    ['issn', 'ISSN'],                      // 3
    ['leidejas', 'Leidėjas'],                  // 4
    ['db', 'Duomenų bazė'],               // 5
    ['pastabos', 'Pastabos']                   // 6
];

var pathPaiesku = '/ieskoti';

var parametrasQueryPaieskuPagalRegex = 'regex';

var pathIrQueryPaieskuPagalRegexBeReiksmesParametro = pathPaiesku + '?' + parametrasQueryPaieskuPagalRegex + '=';

var Autolinker = require( 'autolinker' );

module.exports = {

    /*
     Duomenu bazes adresas.
     */
    urlOfDatabase : 'mongodb://localhost:27017/mongoDBZurnaluProjekto',

    getPavadinimaStulpelio : function (numerisStulpelio) {
        return masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu[numerisStulpelio][1];
    },

    getPavadinimaFieldo : function (numerisFieldo) {
        return masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu[numerisFieldo][0];
    },

    kiekisStulpeliuRodomu : masyvasDvimatisPavadinimuStulpeliuIrAtitinkamuFieldu.length,

    pavadinimasSvetaines : 'Lietuvos mokslo žurnalų sąrašas',

    pristatymasSvetaines : 'Sveiki atvykę į Lietuvos mokslo žurnalų internetinę svetainę!' +
        ' Čia galite rasti visų mokslo bendruomenės žurnalų sąrašą bei sužinoti, kokiose duomenų' +
        ' bazėse talpinamas pilnas šių žurnalų turinys.',

    masyvasRaidziuAbecelesLietuviskos : [
        'A', 'Ą', 'B', 'C', 'Č', 'D', 'E', 'Ę', 'Ė', 'F'
        , 'G', 'H', 'I', 'Į', 'Y', 'J', 'K', 'L', 'M'
        , 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ų', 'Ū', 'V', 'Z', 'Ž'
    ]

    , pathPaiesku : pathPaiesku

    , parametrasQueryPaieskuPagalRegex : parametrasQueryPaieskuPagalRegex

    , pathIrQueryPaieskuPagalRegexBeReiksmesParametro : pathIrQueryPaieskuPagalRegexBeReiksmesParametro

    , Autolinker : Autolinker

}















