
var express = require( 'express' ),
    app = express(),
    bodyParser = require( 'body-parser' ),
    mongoose = require( 'mongoose' ),
    config = require( './config' ),
    logger = require( './modules/logger' ),
    Label = require( './api/models/labelModel' );


//dbSetup
mongoose.Promise = global.Promise;
var mondb = config.environment === 'development' ?
  config.database_url_test : config.database_url;
mongoose.connect( mondb, { useNewUrlParser: true } );

//Accept cross-origin browser requests
app.use( function( req, res, next ){
  res.setHeader( "Access-Control-Allow-Methods", "OPTIONS, DELETE, POST, GET" );
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.header( "Access-Control-Allow-Credentials", true );
  next();
});


//body-parser
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    /*console.log( req.method + ' request to ' + req.originalUrl +' from: '+ ip );
    console.log( "params: " + JSON.stringify( req.params ) );
    console.log( "query: " + JSON.stringify( req.query ) );
    console.log( "body: "+ JSON.stringify( req.body ) );
    console.log( "-------------------------------------" );*/
    logger.info( req.method + ' request to ' + req.originalUrl +' from: '+ ip + ' [' + JSON.stringify( req.body ) + ']');
    next(); // make sure we go to the next routes and don't stop here
});

//routes
var routes = require( './api/routes/labelRoutes' );
routes( app );

//handle bad requests
app.use( function( req, res ){
  res.status( 400 ).send( { respond_code: 3, request_url: req.originalUrl, response_message: "The request URL does not exist.", is_error: true } );
});

app.listen( config.application_port );
logger.info( 'Environment: '+ config.environment );
logger.info( 'Mondb: '+ mondb );
logger.info( 'Host: '+ config.application_url + ' started for services: '+ config.resources );
