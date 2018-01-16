var api = require('api'),
    util = require('util'),
    connect = require('connect');

var port = 7777;
connect.createServer(connect.static(__dirname)).listen(port);
console.log('Static Server listening on :' + port);

api.listen(8889);
