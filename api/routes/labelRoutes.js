'use strict';

module.exports = function( app ){
  var manager = require( '../controllers/labelController' ),
      config = require( '../../config' );

  app.route( config.label_resource )
    .get( manager.list_all_labels )
    .post( manager.create_entry );

  app.route( config.label_resource+'/:label_id' )
    .get( manager.list_entry )
    .delete( manager.remove_entry );
}
