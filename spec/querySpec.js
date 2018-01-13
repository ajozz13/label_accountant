var request = require( 'request' ),
    config = require( '../config' );
var label_resource = config.label_resource;
var label_request_url = config.application_url+label_resource;
var acct_resource = config.accountant_resource;
var acct_qry_resource = acct_resource + "/queries?";
var acct_request_url = config.application_url+acct_qry_resource;

describe( acct_resource+' service tests', function(){
  describe( 'expected calls to '+acct_request_url, function(){

    var label_data = { label_vendor: 'FEDEX', label_track: '[4677657745642]', public_id: '122DEFSX' , ip_address: '192.168.17.12', label_service: '2D', label_station: 'MIA' };
    var label_id;

    setupTests( label_data, label_id );

    var lbl = label_data.label_track.match( /\w+[^\[\]]/ );
    var qry = 'track='+lbl;
    it( 'GET '+acct_qry_resource + qry, function( done ){
      try{
        request.get( acct_request_url + qry, { json: true }, function( error, response, body ){
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 200 );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( acct_qry_resource+qry );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.created_date ).not.toBe( null );
          expect( body.entry.label_vendor ).toBe( label_data.label_vendor );
          expect( body.entry.label_track ).toBe( label_data.label_track );
          expect( body.entry.public_id ).toBe( label_data.public_id );
          expect( body.entry.ip_address ).toBe( label_data.ip_address );
          expect( body.entry.label_service ).toBe( label_data.label_service );
          expect( body.entry.label_station ).toBe( label_data.label_station );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

  });
});

function setupTests( label_data, label_id ){

  beforeAll(function( done ){
    try{
      request.post( label_request_url,
        { json: label_data, headers: { 'Content-Type' : 'application/json' } },
        function( error, response, body ){
          if( error ) throw error;
          label_id = body.entry._id;
          expect( response.statusCode ).toBe( 201 );
          done();
      });
    }catch( exc ){
      console.log( exc );
      done.fail();
    }
  });

  afterAll(function( done ){
    try{
      request.delete( label_request_url+'/'+label_id, { json: true }, function( error, response, body ){
        if( error ) throw error;
        done();
      });
    }catch( exc ){
      console.log( exc );
      done.fail();
    }
  });

/*  beforeEach( function(){
  });

  afterEach( function(){
  });
*/
}
