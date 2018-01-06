var db_server = process.env.DBSERVER || '192.168.17.238';
var port = process.env.PORT || 3000;
var host_url = 'http://localhost:'+port;

module.exports = {
  'database_url' : 'mongodb://'+ db_server +'/labelauditor_db',
  'application_port' : port,
  'application_url' : host_url,
  'label_resource' : '/v1/labelauditor',
  'resources': [ 'label_resource' ]
}
