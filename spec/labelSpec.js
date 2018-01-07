var request = require( 'request' ),
    config = require( '../config' );
var label_resource = config.label_resource;
var label_request_url = config.application_url+label_resource;

describe( label_resource+' service tests', function(){

  describe( 'expected calls to '+label_request_url, function(){
    var label_data = { label_vendor: 'UPS', label_track: '1Z564657rUrksjerIIIES', public_id: '122DEFSX' , ip_address: '192.168.17.12' };
    var label_id;

    it( 'POST - creates a new label entry', function( done ){
      request.post( label_request_url,
        { json: label_data, headers: { 'Content-Type' : 'application/json' } },
        //  { form: user_data },
        function( error, response, body ){
          try{
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
            label_id = body.entry._id;
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
    });

    it( 'OPTIONS - CORS handler', function( done ){
      request.options( label_request_url+'/'+label_id, function( error, response, body ){
        try{
          expect( body ).toBe( 'OK' );
          expect( response.statusCode ).toBe( 200 );
          expect( response.headers ).not.toBe( null );
          expect( response.headers['access-control-allow-methods'] ).toBe( 'OPTIONS, DELETE, POST, GET' );
          expect( response.headers['access-control-allow-origin'] ).toMatch( /ibcinc.com/ );
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });
    });

    it( 'DELETE - removes a label entry', function( done ){
      request.delete( label_request_url+'/'+label_id, { json: true }, function( error, response, body ){
        try{
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
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });
    });

  });

}); //end service tests
