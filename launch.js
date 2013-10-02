var api = require('api'),
    util = require('util'),
    connect = require('connect');

var port = 8888;
connect.createServer(connect.static(__dirname)).listen(port);
util.puts('Static Server listening on :' + port);

api.listen(8889);
