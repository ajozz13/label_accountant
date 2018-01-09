var request = require( 'request' ),
    config = require( '../config' );
var label_resource = config.label_resource;
var label_request_url = config.application_url+label_resource;

describe( label_resource+' service tests', function(){

  describe( 'expected calls to '+label_request_url, function(){
    var label_data = { label_vendor: 'UPS', label_track: '1Z564657rUrksjerIIIES', public_id: '122DEFSX' , ip_address: '192.168.17.12', label_service: '2D', label_station: 'MIA' };
    var label_id;

    it( 'POST - creates a new label entry', function( done ){
      try{
        request.post( label_request_url,
          { json: label_data, headers: { 'Content-Type' : 'application/json' } },
          //  { form: user_data },
          function( error, response, body ){
            if( error ) throw error;
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 201 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "Entry added" );
            expect( body.request_url ).toBe( label_resource );
            expect( body.entry ).not.toBe( null );
            expect( body.entry._id ).not.toBe( null );
            expect( body.entry.created_date ).not.toBe( null );
            expect( body.entry.label_vendor ).toBe( label_data.label_vendor );
            expect( body.entry.label_track ).toBe( label_data.label_track );
            expect( body.entry.public_id ).toBe( label_data.public_id );
            expect( body.entry.ip_address ).toBe( label_data.ip_address );
            expect( body.entry.label_service ).toBe( label_data.label_service );
            expect( body.entry.label_station ).toBe( label_data.label_station );
            label_id = body.entry._id;
            done();
          });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'GET list should be successful ', function( done ){
      try{
        request.get( label_request_url, { json: true }, function( error, response, body ){
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 200 );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( label_resource );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.length ).toBeGreaterThan( 0 );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }

    });

    it( 'GET label by id should be successful ', function( done ){
      try{
        request.get( label_request_url+'/'+label_id, { json: true }, function( error, response, body ){
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 200 );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( label_resource+'/'+label_id );
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

    it( 'OPTIONS - CORS handler', function( done ){
      try{
        request.options( label_request_url+'/'+label_id, function( error, response, body ){
          if( error ) throw error;
          expect( body ).toBe( 'OK' );
          expect( response.statusCode ).toBe( 200 );
          expect( response.headers ).not.toBe( null );
          expect( response.headers['access-control-allow-methods'] ).toBe( 'OPTIONS, DELETE, POST, GET' );
          expect( response.headers['access-control-allow-origin'] ).toMatch( /ibcinc.com/ );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'DELETE - removes a label entry', function( done ){
      try{
        request.delete( label_request_url+'/'+label_id, { json: true }, function( error, response, body ){
          if( error ) throw error;
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 200 );
          expect( body.response_code ).toBe( 0 );
          expect( body.is_error ).toBe( false );
          expect( body.response_message ).toBe( "Entry removed" );
          expect( body.request_url ).toBe( label_resource+'/'+label_id );
          expect( body.entry ).not.toBe( null );
          expect( body.entry._id ).toBe( label_id );
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

  describe( 'possible unexpected calls to '+label_request_url, function(){
    var label_id = "5a54fdb7418ef26ea876b973";
    it( 'GET empty list response', function( done ){
      try{
        request.get( label_request_url, { json: true }, function( error, response, body ){
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 404 );
          expect( body.response_code ).toBe( 1 );
          expect( body.response_message ).toMatch( /list is empty/ );
          expect( body.request_url ).toBe( label_resource );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.length ).toBe( 0 );
          expect( body.error ).toMatch( /list is empty/ );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'GET response to incorrect id', function( done ){
      try{
        request.get( label_request_url+'/'+label_id, { json: true }, function( error, response, body ){
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 400 );
          expect( body.response_code ).toBe( 1 );
          expect( body.response_message ).toMatch( /does not exist/ );
          expect( body.request_url ).toBe( label_resource+'/'+label_id );
          expect( body.entry ).toBe( null );
          expect( body.error ).toMatch( /does not exist/ );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'DELETE response to incorrect id', function( done ){
      try{
        request.delete( label_request_url+'/'+label_id, { json: true }, function( error, response, body ){
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 400 );
          expect( body.response_code ).toBe( 1 );
          expect( body.response_message ).toMatch( /does not exist/ );
          expect( body.request_url ).toBe( label_resource+'/'+label_id );
          expect( body.entry ).toBe( null );
          expect( body.error ).toMatch( /does not exist/ );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

  });

}); //end service tests
