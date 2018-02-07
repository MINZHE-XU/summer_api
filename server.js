// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port =  process.env.PORT ||8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  console.log('Something is happening2.');
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /datagroups
// ----------------------------------------------------

router.route('/datagroups')
    // create a datagroup (accessed at POST http://localhost:8080/api/datagroups)
    .post(function(req, res) {
console.log(req)
        var datagroup = new Datagroup();      // create a new instance of the datagroup model
        datagroup.groupeddata = req.body.groupeddata;  // set the datagroups name (comes from the request)

        // save the datagroup and check for errors
        datagroup.save(function(err, datagroups) {
            if (err)
                res.send({ status:"FAIL", message:"Server cannot find the specified token" });
console.log(err)
            res.json({ status:"SUCCESS", message: datagroups });
        });

    })

    // get all the datagroups (accessed at GET http://localhost:8080/api/datagroups)
    .get(function(req, res) {
        Datagroup.find(function(err, datagroups) {
            if (err)
                res.send(err);
            res.json(datagroups);
        });
    });

// on routes that end in /datagroups/:datagroup_id
// ----------------------------------------------------
router.route('/datagroups/:datagroup_id')

    // get the datagroup with that id (accessed at GET http://localhost:8080/api/datagroups/:datagroup_id)
    .get(function(req, res) {
      if (req.params.datagroup_id.match(/^[0-9a-fA-F]{24}$/)) {
        Datagroup.findById(req.params.datagroup_id, function(err, datagroups) {
          console.log(err)
            if (err)
                res.send({ status:"FAIL", message:"Cannot find the dataset for this token" });
            res.json({ status:"SUCCESS", message: datagroups });
        });
      }else{
          res.send({ status:"FAIL", message:"Cannot find the dataset for this token" });
      }
    })
 // update the datagroup with this id (accessed at PUT http://localhost:8080/api/datagroups/:datagroup_id)
    .put(function(req, res) {

        // use our datagroup model to find the datagroup we want
        Datagroup.findById(req.params.datagroup_id, function(err, datagroup) {

            if (err)
                res.send(err);

            datagroup.groupeddata = req.body.groupeddata;  // update the datagroups info

            // save the datagroup
            datagroup.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'datagroup updated!' });
            });

        });
    })

    .delete(function(req, res) {
        Datagroup.remove({
            _id: req.params.datagroup_id
        }, function(err, datagroup) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port,  function(err){
  if(err){
    return console.log(err);
  }

});
console.log('Magic happens on port ' + port);

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/map'); // connect to our database
var Datagroup     = require('./app/models/datagroup');
