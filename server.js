// droplet IP address: 138.68.251.126
var express = require('express');
var app = express();
//var server = require('http').createServer();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8081;
app.use(express.static(__dirname + '/public'));


var players = [];

function Player (id) {
  this.id = id;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.entity = null;
  this.lastCollision = null;
}

io.sockets.on('connection', function(socket) {
  socket.on('initialize', function() {
    var idNum = players.length;
    var newPlayer = new Player (idNum);

    players.push(newPlayer);

    socket.emit('playerData', {id: idNum, players: players});


    socket.broadcast.emit('playerJoined', newPlayer);
  });

  socket.on('positionUpdate', function(data) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
    players[data.id].z = data.z;

    socket.broadcast.emit('playerMoved', data);
  });
});

console.log('server running');
server.listen(port);