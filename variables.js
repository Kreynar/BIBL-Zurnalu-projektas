/**
 * Created by Martynas on 4/11/2016.
 */

var app = require('app');


/*
 Situ masyvu elementu pavadinimus butina pakeisti, jei keisis duomenu bazeje
 field'u pavadinimai (arba bus nauju fieldu, kuriuos reikes atvaizduoti
 lenteleje)!!!!!!!!!!!!!!!!!!!!
 */

var metadataZurnalu = {

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

var metadataLeideju = {

    /*
     <aliasStulpelioArbaFieldo>     <arRodytLentelej> <arFiksuojamaDb> <pavadinimasStulpelio> <pavadinimasFieldo>
     */
    checkboxTrynimoIrKeitimo :     [true,                 false,         '',                        '']
    , id :                         [false,                true,          '',                        '_id']
    , arIstrintas :                [false,                true,          '',                       'aristrintas']
    , nr :                         [true,                 false,         'Nr.',                     '']
    , pavadinimas1 :               [true,                 true,          'Pavadinimas',            'pavadinimas1']
    , pavadinimas2 :               [true,                 true,          'Kitas pavadinimas',      'pavadinimas2']
    , pastabos :                   [true,                 true,          'Pastabos',               'pastabos']
};

var metadataDuomenuBaziu = {

    /*
     <aliasStulpelioArbaFieldo>     <arRodytLentelej> <arFiksuojamaDb> <pavadinimasStulpelio> <pavadinimasFieldo>
     */
    checkboxTrynimoIrKeitimo :     [true,                 false,         '',                        '']
    , id :                         [false,                true,          '',                        '_id']
    , arIstrintas :                [false,                true,          '',                       'aristrintas']
    , nr :                         [true,                 false,         'Nr.',                     '']
    , pavadinimas1 :               [true,                 true,          'Pavadinimas',            'pavadinimas1']
    , pavadinimas2 :               [true,                 true,          'Kitas pavadinimas',      'pavadinimas2']
    , pastabos :                   [true,                 true,          'Pastabos',               'pastabos']
};


module.exports = ({

    inicializuotiObjekta : function() {

        this.urlOfDatabase = 'mongodb://localhost:27017/mongoDBZurnaluProjekto';

        this.getPavadinimaStulpelio = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataZurnalu[aliasArbaNumerisStulpelioArbaFieldo][2];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataZurnalu[Object.keys(metadataZurnalu)[aliasArbaNumerisStulpelioArbaFieldo]][2];
            }
        };

        this.getPavadinimaFieldo = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo === 'string') {
                return metadataZurnalu[aliasArbaNumerisStulpelioArbaFieldo][3];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataZurnalu[Object.keys(metadataZurnalu)[aliasArbaNumerisStulpelioArbaFieldo]][3];
            }
            else {

            }
        };

        this.getAliasStulpelioArbaFieldo = function (numerisStulpelioArbaFieldo) {
            return Object.keys(metadataZurnalu)[numerisStulpelioArbaFieldo];
        };

        this.getArRodomasStulpelisLenteleje = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataZurnalu[aliasArbaNumerisStulpelioArbaFieldo][0];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataZurnalu[Object.keys(metadataZurnalu)[aliasArbaNumerisStulpelioArbaFieldo]][0];
            }
        };

        this.getArFiksuojamasStulpelisDuomenuBazeje = function (aliasArbaNumerisStulpelioArbaFieldo) {
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataZurnalu[aliasArbaNumerisStulpelioArbaFieldo][1];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataZurnalu[Object.keys(metadataZurnalu)[aliasArbaNumerisStulpelioArbaFieldo]][1];
            }
        };

        this.getObjektaError404 = function(errorObjektasOriginalus) {
            if (errorObjektasOriginalus) {
                console.log(errorObjektasOriginalus);
            }
            var err = new Error(this.pranesimas404);
            err.status = 404;
            return err;
        };

        this.getObjektaErrorNegeraPaieskosFraze = function(errorObjektasOriginalus) {
            if (errorObjektasOriginalus) {
                console.log(errorObjektasOriginalus);
            }
            var err = new Error(this.pranesimasFrazePaieskosNegera);
            err.status = 422;
            return err;
        };
        
        this.getObjektaErrorTechniniaiNesklandumai = function(errorObjektasOriginalus) {
            if (errorObjektasOriginalus) {
                console.log(errorObjektasOriginalus);
            }
            var err = new Error(this.pranesimasTechniniaiNesklandumai);
            err.status = 500;
            return err;
        };

        this.getKiekiStulpeliuIrFieldu = function(pavadinimasCollection) {
            var kiekisStulpeliuIrFieldu = 0;
            if (pavadinimasCollection == 'zurnalai') {
                kiekisStulpeliuIrFieldu = Object.keys(metadataZurnalu).length;
            }
            else if (pavadinimasCollection == 'leidejai') {
                kiekisStulpeliuIrFieldu = Object.keys(metadataLeideju).length;
            }
            else if (pavadinimasCollection == 'duomenubazes') {
                kiekisStulpeliuIrFieldu = Object.keys(metadataDuomenuBaziu).length;
            }
            else {
                kiekisStulpeliuIrFieldu = 0;
            }
            return kiekisStulpeliuIrFieldu;
        };

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
        this.pathZurnalai = '/zurnalai';
        this.pathZurnalasNaujas = this.pathZurnalai + '/naujas';
        this.pathZurnalasAnksciauSukurtas = this.pathZurnalai + '/:id';
        this.parametrasQueryPaieskuPagalRaide = 'raide';
        this.parametrasQueryPaieskuPagalFraze = 'fraze';

        this.pathLeidejai = '/leidejai';
        this.pathLeidejasNaujas = this.pathLeidejai + '/naujas';
        this.pathLeidejasAnksciauSukurtas = this.pathLeidejai + '/:id';

        this.pathDuomenuBazes = '/duomenu-bazes';
        this.pathDuomenuBazeNauja = this.pathDuomenuBazes + '/naujas';
        this.pathDuomenuBazeAnksciauSukurta = this.pathDuomenuBazes + '/:id';


        this.pranesimas404 = 'Ieškomas puslapis nerastas';
        this.pranesimasFrazePaieskosNegera = 'Įvyko klaida. Pamėginkite pakeisti paieškos frazę.';
        this.pranesimasTechniniaiNesklandumai = 'Techninis nesklandumas. Pamėginkite vėliau.';

        this.Autolinker = require( 'autolinker' );

        this.$salygaPaieskosTikNeistrintuIrasu = { '$or' : [ { 'aristrintas':{'$exists':false} }, { 'aristrintas':{'$ne':true} } ] };

        return this;
    }

}).inicializuotiObjekta();



 











