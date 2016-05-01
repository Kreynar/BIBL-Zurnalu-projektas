/**
 * Created by Martynas on 4/11/2016.
 */

var app = require('../app');


/*
 Sito masyvo elementu pavadinimus gali tekti pakeisti, jei keisis duomenu bazeje
 field'u pavadinimai (arba bus nauju fieldu, kuriuos reikes atvaizduoti
 lenteleje)!!!!!!!!!!!!!!!!!!!!
 */
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
    // urlOfDatabase : 'mongodb://localhost:27017/mongoDBZurnaluProjekto',
    //
    // getPavadinimaStulpelio : function (aliasArbaNumerisStulpelioArbaFieldo) {
    //     if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
    //         return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][2];
    //     }
    //     else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
    //         return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][2];
    //     }
    // },
    //
    // getPavadinimaFieldo : function (aliasArbaNumerisStulpelioArbaFieldo) {
    //     if (typeof aliasArbaNumerisStulpelioArbaFieldo === 'string') {
    //         return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][3];
    //     }
    //     else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
    //         return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][3];
    //     }
    //     else {
    //
    //     }
    // },
    //
    // getAliasStulpelioArbaFieldo : function (numerisStulpelioArbaFieldo) {
    //     return Object.keys(metadataStulpeliuIrFieldu)[numerisStulpelioArbaFieldo];
    // },
    //
    // getArRodytiStulpeliLenteleje : function (aliasArbaNumerisStulpelioArbaFieldo) {
    //     if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
    //         return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][0];
    //     }
    //     else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
    //         return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][0];
    //     }
    // },
    //
    // gerArFiksuojamasStulpelisDuomenuBazeje : function (aliasArbaNumerisStulpelioArbaFieldo) {
    //     if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
    //         return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][1];
    //     }
    //     else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
    //         return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][1];
    //     }
    // },
    //
    // kiekisStulpeliuArbaFieldu : Object.keys(metadataStulpeliuIrFieldu).length,
    //
    // pavadinimasSvetaines : 'Lietuvos mokslo žurnalų sąrašas',
    //
    // pristatymasSvetaines : 'Sveiki atvykę į Lietuvos mokslo žurnalų internetinę svetainę!' +
    //     ' Čia galite rasti visų mokslo bendruomenės žurnalų sąrašą bei sužinoti, kokiose duomenų' +
    //     ' bazėse talpinamas pilnas šių žurnalų turinys.',
    //
    // masyvasRaidziuAbecelesLietuviskos : [
    //     'A', 'Ą', 'B', 'C', 'Č', 'D', 'E', 'Ę', 'Ė', 'F'
    //     , 'G', 'H', 'I', 'Į', 'Y', 'J', 'K', 'L', 'M'
    //     , 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ų', 'Ū', 'V', 'Z', 'Ž'
    // ]
    //
    // , pathPaiesku : '/ieskoti'
    //
    // , pathTrintiIrasa : '/trinti-irasa'
    //
    // , pathPostNaujaIrasa : '/sukurti-nauja-irasa'
    //
    // , parametrasQueryPaieskuPagalRegex : 'regex'
    //
    // , pranesimas404 : 'Ieškomas puslapis nerastas'
    //
    // , pranesimasFrazePaieskosNegera : 'Įvyko klaida. Pamėginkite pakeisti paieškos frazę.'


    // , inicializuotiObjekta : function() {

    inicializuotiObjekta : function() {

        this.urlOfDatabase = 'mongodb://localhost:27017/mongoDBZurnaluProjekto';

        this.getPavadinimaStulpelio = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][2];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][2];
            }
        };

        this.getPavadinimaFieldo = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo === 'string') {
                return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][3];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][3];
            }
            else {

            }
        };

        this.getAliasStulpelioArbaFieldo = function (numerisStulpelioArbaFieldo) {
            return Object.keys(metadataStulpeliuIrFieldu)[numerisStulpelioArbaFieldo];
        };

        this.getArRodytiStulpeliLenteleje = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][0];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][0];
            }
        };

        this.gerArFiksuojamasStulpelisDuomenuBazeje = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataStulpeliuIrFieldu[aliasArbaNumerisStulpelioArbaFieldo][1];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataStulpeliuIrFieldu[Object.keys(metadataStulpeliuIrFieldu)[aliasArbaNumerisStulpelioArbaFieldo]][1];
            }
        };

        this.kiekisStulpeliuArbaFieldu = Object.keys(metadataStulpeliuIrFieldu).length;

        this.pavadinimasSvetaines = 'Lietuvos mokslo žurnalų sąrašas';

        this.pristatymasSvetaines = 'Sveiki atvykę į Lietuvos mokslo žurnalų internetinę svetainę!' +
        ' Čia galite rasti visų mokslo bendruomenės žurnalų sąrašą bei sužinoti, kokiose duomenų' +
        ' bazėse talpinamas pilnas šių žurnalų turinys.';

        this.masyvasRaidziuAbecelesLietuviskos = [
            'A', 'Ą', 'B', 'C', 'Č', 'D', 'E', 'Ę', 'Ė', 'F'
            , 'G', 'H', 'I', 'Į', 'Y', 'J', 'K', 'L', 'M'
            , 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ų', 'Ū', 'V', 'Z', 'Ž'
            // , 'a', 'ą', 'b', 'c', 'č', 'd', 'e', 'ę', 'ė', 'f'
            // , 'g', 'h', 'i', 'į', 'y', 'j', 'k', 'l', 'm'
            // , 'n', 'o', 'p', 'r', 's', 'š', 't', 'u', 'ų', 'ū', 'v', 'z', 'ž'
        ];

        this.pathIndex = '/';
        this.pathCollectionZurnalu = '/';
        this.pathZurnalasNaujas = '/naujas';
        this.pathZurnalasAnksciauSukurtas = '/:id';
        this.parametrasQueryPaieskuPagalRaide = 'raide';
        this.parametrasQueryPaieskuPagalFraze = 'fraze'; 
        this.pranesimas404 = 'Ieškomas puslapis nerastas';

        this.pranesimasFrazePaieskosNegera = 'Įvyko klaida. Pamėginkite pakeisti paieškos frazę.';

        this.Autolinker = require( 'autolinker' );

        this.$salygaPaieskosTikNeistrintuIrasu = { '$or' : [ { 'aristrintas':{'$exists':false} }, { 'aristrintas':{'$ne':true} } ] };

        return this;
    }

}).inicializuotiObjekta();



 











