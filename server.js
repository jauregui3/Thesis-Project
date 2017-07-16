var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8081;

var testVar = 'server var';

var players = [];

app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log('listening on port >>>>' + port);
});

io.on('connection', function (socket) {
  console.log('emiting playerId')
  socket.emit('playerId', {
    playerId: players.length
  });
  console.log('pushing new player to array');
  players.push({});
  socket.on('clientUpdate', function (data) {
    //console.log('client update',data, players);
    socket.broadcast.emit('multiplayerUpdate', data);
  });

  socket.on('createBot', function (data) {
    console.log('createBot', data);
    players[data.playerId] = data;
    /*
    playerObj['x'] = data.x;
    playerObj.y = data.y;
    playerObj.playerId = data.playerId;
    playerObj.tint = data.tint;
    */
    socket.broadcast.emit('createMultiplayer', {
      x: data.x,
      y: data.y,
      playerId: data.playerId,
      tint: data.tint
    });
  });

  socket.on('givePlayers', function () {
    players.map(function(cur) {
      console.log('sending on givePlayers', cur);
      socket.emit('createMultiplayer', {
        x: cur.x,
        y: cur.y,
        playerId: cur.playerId,
        tint: cur.tint
      })
    });
  });

});

module.exports = testVar;
