var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {

  var MongoClient = mongodb.MongoClient;
  var urlManoSukurtosMongoDuombazes = 'mongodb://localhost:27017/mongoDBZurnaluProjekto';
  // res.render('index', { title: 'Lietuvos mokslo žurnalai' });
  MongoClient.connect(urlManoSukurtosMongoDuombazes, function(err, db) {
    if (err) {
      console.log('Erroras meginant connectintis prie mongoDBZurnaluProjekto:', err);
    }
    else {
      console.log('Prisijungem prie mongoDBZurnaluProjekto!');
      var collectionZurnalai = db.collection('zurnalai');
      collectionZurnalai.find({}).toArray(function(err, masyvasZurnaluDocumentu){
        if (err) {
          console.log(err);
        }
        // else if (sarasasZurnalu.length) {
        //
        // }
        else {
          console.log('masyvasZurnaluDocumentu1: ', masyvasZurnaluDocumentu, '@@@');
          res.render('index', {
            masyvasZurnaluDocumentu: masyvasZurnaluDocumentu
          });
          db.close(function() {
            console.log('Tiketina, kad ivykdyta db.close()')
          });
        }
      });

    }
  });


});



/* GET @@@authentificavimo puslapis. */
router.get('/prisijungimas', function(req, res, next) {
  res.render('prisijungimas', { title: 'Lietuvos mokslo žurnalai' });
});



/* GET Userlist page. */
router.get('/useriusarasas', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
    res.render('useriusarasas', {
      "useriusarasas" : docs
    });
  });
});





//9. Open sampsite/routes/index.js in a text editor like NotePad++ and add the following after router = express.Router() but before module.exports = router;

router.get('/thelist', function(req, res){

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/sampsite';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      // We are connected
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('students');

      // Find all students
      collection.find({}).toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          res.render('studentlist',{

            // Pass the returned database documents to Jade
            "studentlist" : result
          });
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    }
  });
});



module.exports = router;