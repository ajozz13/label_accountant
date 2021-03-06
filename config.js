var db_server = process.env.DBSERVER || '192.168.17.238';
var port = process.env.PORT || 3000;
var host_url = 'http://localhost:'+port;
var env = process.env.NODE_ENV || 'development';


module.exports = {
  'database_url' : 'mongodb://'+ db_server +'/labelauditor_db',
  'database_url_test' : 'mongodb://'+ db_server +'/tst_labelauditor_db',
  'application_port' : port,
  'application_url' : host_url,
  'label_resource' : '/v1/labelauditor',
  'accountant_resource' : '/v1/accountant',
  'resources': [ 'label_resource' ],
  'application_name': 'labelauditor',
  'environment' : env
}
