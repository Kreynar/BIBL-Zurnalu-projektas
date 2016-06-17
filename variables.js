/**
 * Created by Martynas on 4/11/2016.
 */

// var app = require('app');


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


        this.getMetadataOfCollection = function(nameOfCollection) {
            if (nameOfCollection == 'zurnalai') {
                return metadataZurnalu;
            }
            else if (nameOfCollection == 'leidejai') {
                return metadataLeideju;
            }
            else if (nameOfCollection == 'duomenu-bazes') {
                return metadataDuomenuBaziu;
            }
        };

        this.getInfoApieStulpeliArbaFielda = function(pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo, numberOfTypeOfInformation) {
            var metadataOfCollection = this.getMetadataOfCollection(pavadinimasCollection);
            var masyvasAliasIsMetadata = Object.keys(metadataOfCollection);
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                return metadataOfCollection[aliasArbaNumerisStulpelioArbaFieldo][numberOfTypeOfInformation];
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                return metadataOfCollection[masyvasAliasIsMetadata[aliasArbaNumerisStulpelioArbaFieldo]][numberOfTypeOfInformation];
            }
        };

        this.getArRodomasStulpelisLenteleje = function (pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo) {
            return this.getInfoApieStulpeliArbaFielda(pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo, 0);
        };

        this.getArFiksuojamasFieldasDuomenuBazeje = function (pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo) {
            return this.getInfoApieStulpeliArbaFielda(pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo, 1);
        };

        this.getPavadinimaStulpelio = function (pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo) {
            return this.getInfoApieStulpeliArbaFielda(pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo, 2);
        };

        this.getPavadinimaFieldo = function (pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo) {
            return this.getInfoApieStulpeliArbaFielda(pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo, 3);
        };

        this.getAliasArbaNumeriStulpelioArbaFieldo = function (pavadinimasCollection, aliasArbaNumerisStulpelioArbaFieldo) {
            var metadataOfCollection = this.getMetadataOfCollection(pavadinimasCollection);
            var masyvasAliasIsMetadata = Object.keys(metadataOfCollection);
            var numerisStulpelioArbaFieldo = -1;
            var aliasStulpelioArbaFieldo = "";
            if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'string') {
                for (var i = 0; i < masyvasAliasIsMetadata.length; i++) {
                    if (aliasArbaNumerisStulpelioArbaFieldo == masyvasAliasIsMetadata[i]) {
                        numerisStulpelioArbaFieldo = i;
                        return numerisStulpelioArbaFieldo;
                    }
                }
            }
            else if (typeof aliasArbaNumerisStulpelioArbaFieldo == 'number') {
                aliasStulpelioArbaFieldo = masyvasAliasIsMetadata[aliasArbaNumerisStulpelioArbaFieldo];
                return aliasStulpelioArbaFieldo;
            }
        };

        this.getKiekiStulpeliuIrFieldu = function(pavadinimasCollection) {
            var kiekisStulpeliuIrFieldu = 0;
            if (pavadinimasCollection == 'zurnalai') {
                kiekisStulpeliuIrFieldu = Object.keys(metadataZurnalu).length;
            }
            else if (pavadinimasCollection == 'leidejai') {
                kiekisStulpeliuIrFieldu = Object.keys(metadataLeideju).length;
            }
            else if (pavadinimasCollection == 'duomenu-bazes') {
                kiekisStulpeliuIrFieldu = Object.keys(metadataDuomenuBaziu).length;
            }
            else {
                kiekisStulpeliuIrFieldu = 0;
            }
            return kiekisStulpeliuIrFieldu;
        };

        this.logIConsoleErrorOriginalu = function(errorObjektasOriginalus) {
            if (errorObjektasOriginalus) {
                console.log(errorObjektasOriginalus);
            }
        };

        this.getObjektaError404 = function(errorObjektasOriginalus) {
            this.logIConsoleErrorOriginalu(errorObjektasOriginalus);
            var err = new Error(this.pranesimas404);
            err.status = 404;
            return err;
        };

        this.getObjektaErrorNegeraPaieskosFraze = function(errorObjektasOriginalus) {
            this.logIConsoleErrorOriginalu(errorObjektasOriginalus);
            var err = new Error(this.pranesimasFrazePaieskosNegera);
            err.status = 422;
            return err;
        };

        this.getObjektaErrorTechniniaiNesklandumai = function(errorObjektasOriginalus) {
            this.logIConsoleErrorOriginalu(errorObjektasOriginalus);
            var err = new Error(this.pranesimasTechniniaiNesklandumai);
            err.status = 500;
            return err;
        };

        this.getObjektaErrorNeteisingasPrisijungimas = function(errorObjektasOriginalus) {
            this.logIConsoleErrorOriginalu(errorObjektasOriginalus);
            var err = new Error(this.pranesimasNeteisingasVardasArbaSlaptazodis);
            err.status = 401;
            return err;
        };

        this.pavadinimasSvetaines = 'Lietuvos mokslo žurnalų sąrašas';

        this.pristatymasSvetaines = 'Šioje svetainėje pateikiamas Lietuvos mokslo žurnalų sąrašas.';

        this.masyvasRaidziuAbecelesLietuviskos = [
            'A', 'Ą', 'B', 'C', 'Č', 'D', 'E', 'Ę', 'Ė', 'F'
            , 'G', 'H', 'I', 'Į', 'Y', 'J', 'K', 'L', 'M'
            , 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ų', 'Ū', 'V', 'Z', 'Ž'
            // , 'a', 'ą', 'b', 'c', 'č', 'd', 'e', 'ę', 'ė', 'f'
            // , 'g', 'h', 'i', 'į', 'y', 'j', 'k', 'l', 'm'
            // , 'n', 'o', 'p', 'r', 's', 'š', 't', 'u', 'ų', 'ū', 'v', 'z', 'ž'
        ];



        // this.pathUser = '/';
        this.pathLogin = '/prisijungimas';
        this.pathLoginFailed = '/prisijungimo-klaida';
        this.pathAdmin = '/mabpcadmin'; /* Bus naudojamas, kol nebus prisiloginimo sukurta */
        this.pathIndex = '/';
        this.pathNaujas = '/naujas';
        this.parametrasQueryPaieskuPagalRaide = 'raide';
        this.parametrasQueryPaieskuPagalFraze = 'fraze';

        this.pathZurnalai = '/zurnalai';
        this.pathZurnalasNaujas = this.pathZurnalai + this.pathNaujas;
        this.pathZurnalasAnksciauSukurtas = this.pathZurnalai + '/:id';


        this.pathLeidejai = '/leidejai';
        this.pathLeidejasNaujas = this.pathLeidejai + this.pathNaujas;
        this.pathLeidejasAnksciauSukurtas = this.pathLeidejai + '/:id';

        this.pathDuomenuBazes = '/duomenu-bazes';
        this.pathDuomenuBazeNauja = this.pathDuomenuBazes + this.pathNaujas;
        this.pathDuomenuBazeAnksciauSukurta = this.pathDuomenuBazes + '/:id';


        this.pranesimas404 = 'Ieškomas puslapis nerastas';
        this.pranesimasFrazePaieskosNegera = 'Įvyko klaida. Pamėginkite pakeisti paieškos frazę.';
        this.pranesimasTechniniaiNesklandumai = 'Techninis nesklandumas. Pamėginkite vėliau.';
        this.pranesimasNeteisingasVardasArbaSlaptazodis = 'Prisijungti nepavyko. Neteisingas vartotojo vardas ir/arba slaptažodis.';

        this.Autolinker = require( 'autolinker' );

        this.$salygaPaieskosTikNeistrintuIrasu = { '$or' : [ { 'aristrintas':{'$exists':false} }, { 'aristrintas':{'$ne':true} } ] };

        return this;
    }

}).inicializuotiObjekta();

