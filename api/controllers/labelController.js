'use strict';

var mongoose = require( 'mongoose' ),
    logger = require( '../../modules/logger' ),
    Labels = mongoose.model( 'LabelModel' );

//GET 'config.label_resource'
exports.list_all_labels = function( req, res ){
  Labels.find( {}, function( err, labels ){
    handleAnswer( res, req.originalUrl, err, labels, 200, 'OK', 'Label list is empty' );
  });
};

//POST 'config.label_resource'
exports.create_entry = function( req, res ){
  var new_label = new Labels( req.body );
  new_label.save( function( err, label ){
    handleAnswer( res, req.originalUrl, err, label, 201, 'Entry added', 'Entry could not be created' );
  });
};

//GET 'config.label_resource/:label_id'
exports.list_entry = function( req, res ){
  Labels.findOne( { _id: req.params.label_id }, function( err, label ){
    handleAnswer( res, req.originalUrl, err, label, 200, 'OK', 'Label '+ req.params.label_id +' does not exist' );
  });
};

//DELETE 'config.label_resource/:label_id'
exports.remove_entry = function( req, res ){
  Labels.findByIdAndRemove( { _id: req.params.label_id }, function( err, label ){
    handleAnswer( res, req.originalUrl, err, label, 200, 'Entry removed', 'Label '+ req.params.label_id +' does not exist' );
  });
};

//options
exports.options_handler = function( req, res ){
  res.setHeader( "Access-Control-Allow-Methods", "OPTIONS, DELETE, POST, GET" );
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.header( "Access-Control-Allow-Credentials", true );
  res.sendStatus( 200 );
}

//Accounant queries
exports.accountant_queries = function( req, res ){
  var obj = req.query;
  var req_counts = obj.hasOwnProperty( '_counts' );
  if( req_counts ){
    delete obj._counts;
  }
  var key = Object.keys(obj)[0];
  var val = obj[key];

  if( key ){
    switch ( key ) {
      case 'label_track':
        //send = false;
        Labels.findOne( { label_track: "["+ val +"]" }, function( err, label ){
          handleAnswer( res, req.originalUrl, err, label, 200, 'OK', 'Track '+ val +' does not exist' );
        });
        break;
      default:
        searchBy( req.query, req_counts, key, req, res );
    }

    console.log( obj );
  }else{
    sendResponse( res, 400, 2, "Request is not available", req.originalUrl );
  }
}

function getURL( req ){
  return req.protocol+"://"+req.get('host')+req.path;
}

function searchBy( obj, counts, by, req, res ){
  var key = Object.keys(obj)[0];
  var val = obj[key];
  if( counts ){
    var ans = {};
    Labels.count( obj,function( err, count ){
      ans[ 'label_count' ] = count;
      var msg = 'There are '+ count + ' entries with ' + key.toUpperCase()+ ': '+ val;
      ans[ 'description' ] = msg;
      ans[ 'json_url' ] = getURL(req) + '?' + toRequestParams( obj ); // +by+'='+val;
      var nmsg = 'No entries found with ' + key.toUpperCase()+ ': '+ val;
      handleAnswer( res, req.originalUrl, err, ans, 200, 'OK', nmsg );
    });
  }else{
    Labels.find( obj, function( err, labels ){
      handleAnswer( res, req.originalUrl, err, labels, 200, 'OK', 'The list is empty' );
    });
  }
}

function toRequestParams( obj ){
  return Object.keys( obj ).map( function( k ) {
    return encodeURIComponent( k ) + '=' + encodeURIComponent( obj[ k ] )
  }).join( '&' );
}

function handleAnswer( res, req_url, err, entry, http_code, positive_message, negative_message ){
  if( err ){
    http_code = err.errors ? 400 : 500;
    sendResponse( res, http_code, 2, 'Request could not be completed', req_url, entry, err );
  }else{
    if( entry == null ){
      sendResponse( res, 400, 1, negative_message, req_url, entry, err );
    }else{
      if( entry.length == 0 ){
        sendResponse( res, 404, 1, negative_message, req_url, entry, err );
      }else{
        sendResponse( res, http_code, 0, positive_message, req_url, entry, err );
      }
    }
  }
}

function sendResponse( res, http_code, response_code, response_message, url, entry, error ){
  try{
    if( http_code == 200 || http_code == 201 ){
      res.status( http_code ).json( { response_code: response_code, response_message: response_message, request_url: url, entry: entry, is_error: false } );
      error = '';
    }else{
      if( null === error )
        error = response_message;
      res.status( http_code ).send( { response_code: response_code, response_message: response_message, request_url: url, entry: entry, error: error, is_error: true } );
    }
  }catch( exception ){
    logger.warn( exception );
  }finally{
    logger.info( 'Responds '+ http_code + ':'+ response_code + '-' +response_message + '-' + error );
  }
}
