'use strict';

module.exports = function( app ){
  var manager = require( '../controllers/labelController' ),
    path = require('path'),
    config = require( '../../config' );

  app.route( config.accountant_resource )
    .get( function( req, res ){
      res.sendFile( path.join( __dirname + '../../../static/accountant.html' ) )
    });

  app.route( config.accountant_resource +'/queries' )
    .get( manager.accountant_queries );

  app.route( config.label_resource )
    .get( manager.list_all_labels )
    .post( manager.create_entry );

  app.route( config.label_resource+'/:label_id' )
    .get( manager.list_entry )
    .options( manager.options_handler )
    .delete( manager.remove_entry );
}
