var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8081;



app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log('listening on port >>>>' + port);
});

io.on('connection', function (socket) {

  socket.on('clientUpdate', function (data) {
    console.log('client update',data);
  });

});