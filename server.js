var util = require('util'),
  connect = require('connect');

function listen(port){
  connect.createServer(connect.static(__dirname)).listen(port);
  util.puts('Listening on ' + port + '...');
  util.puts('Press Ctrl + C to stop.');
}

exports.listen = listen;
