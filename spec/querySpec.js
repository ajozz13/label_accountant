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

    it( 'GET - query using track number', function( done ){
      var itm = label_data.label_track.match( /\w+[^\[\]]/ );
      var qry = 'label_track='+itm;
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

    describe( 'expected calls by IP address', function(){
      var itm = label_data.ip_address;
      var qry = 'ip_address='+itm;
      var cflg = '&_counts';
      var json_url;
      it( 'GET - retrieve counts', function( done ){
        try{
          request.get( acct_request_url+qry+cflg, { json: true }, function( error, response, body ){
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( acct_qry_resource+qry+cflg );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.label_count ).toBe( 1 );
            expect( body.entry.description ).toMatch( /1 entries with IP_ADDRESS/ );
            expect( body.entry.json_url ).toBe( acct_request_url + qry );
            json_url = body.entry.json_url;
            done();
          });
        }catch( exc ){
          console.log( exc );
          done.fail();
        }
      });

      it( 'GET - retrieve list', function( done ){
        try{
          request.get( json_url, { json: true }, function( error, response, body ){
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( acct_qry_resource+qry );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.length ).toBe( 1 );
            done();
          });
        }catch( exc ){
          console.log( exc );
          done.fail();
        }
      });
    });

    describe( 'expected calls compound queries', function(){

      var itm = label_data.ip_address;
      var itm2 = label_data.label_station;
      var qry = 'ip_address='+itm+'&label_station='+itm2;
      var cflg = '&_counts';
      var json_url;
      var x, y;
      x = y = Date.now();
      var today = new Date( x );
      var tomorrow = new Date( y );
      tomorrow.setDate( tomorrow.getDate() + 1 );
      qry2='label_vendor='+label_data.label_vendor+'&_start='+ getDateFormat(today) +'&_end='+getDateFormat(tomorrow);

      it( 'GET - compound query retrieve counts', function( done ){
        try{
          request.get( acct_request_url+qry+cflg, { json: true }, function( error, response, body ){
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( acct_qry_resource+qry+cflg );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.label_count ).toBe( 1 );
            expect( body.entry.description ).toMatch( /1 entries with/ );
            expect( body.entry.json_url ).toBe( acct_request_url + qry );
            json_url = body.entry.json_url;
            done();
          });
        }catch( exc ){
          console.log( exc );
          done.fail();
        }
      });

      it( 'GET - compound query retrieve list', function( done ){
        try{
          request.get( json_url, { json: true }, function( error, response, body ){
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( acct_qry_resource+qry );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.length ).toBe( 1 );
            done();
          });
        }catch( exc ){
          console.log( exc );
          done.fail();
        }
      });

      it( 'GET - query using vendor and date_range counts', function( done ){
        try{
          request.get( acct_request_url+qry2+cflg, { json: true }, function( error, response, body ){
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( acct_qry_resource+qry2+cflg );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.label_count ).toBe( 1 );
            expect( body.entry.description ).toMatch( /1 entries with/ );
            expect( body.entry.json_url ).toBe( acct_request_url+qry2 );
            json_url = body.entry.json_url;
            done();
          });
        }catch( exc ){
          console.log( exc );
          done.fail();
        }
      });

      it( 'GET - query using vendor and date_range list', function( done ){
        try{
          request.get( json_url, { json: true }, function( error, response, body ){
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( acct_qry_resource+qry2 );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.length ).toBe( 1 );
            done();
          });
        }catch( exc ){
          console.log( exc );
          done.fail();
        }
      });

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
          //console.log( "Test entry added " + response.statusCode );
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
        //console.log( "Test entry removed " + response.statusCode );
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

//Helpers
function pad(n){return n<10 ? '0'+n : n;}

function getDateFormat( dt ){
  return dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());
}
function getTimeZoneDateFormat( dt ){
  return dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate())+' '+pad(dt.getHours())+':'+pad(dt.getMinutes())+':'+pad(dt.getSeconds());
}

function ISODateString(d){
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
}
