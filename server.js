var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8081;

var testVar = 'server var';
module.exports = testVar; // for travis CI

app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
  console.log('listening on port >>>>' + port);
});

//_____________________________________________________________________________
// Begin of Socket IO stuff

var players = [];
/*
  { id: 'yX0TqQvwmdmvd_XUAAAA' },
  { x: 400,
    y: 300,
    playerId: 1,
    tint: 15754094.832733741,
    playerName: 'asdf' }
*/

io.on('connection', function(socket) { // 2222222222222222222222222222222222222
  players.push({/*id: socket.id*/});

  socket.emit('playerId', { // 333333333333333333333333333333333333333333333333
    playerId: players.length
  });

  socket.on('createBot', function (data) { // 666666666666666666666666666666666
    players[data.playerId] = data;
    socket.broadcast.emit('createMultiplayer', { // 777777777777777777777777777
      x: data.x,
      y: data.y,
      playerId: data.playerId,
      tint: data.tint,
      playerName: data.playerName
    });
  });

  socket.on('givePlayers', function () { // 10.10.10.10.10.10.10.10.10.10.10.10
    players.map(function(cur) {
      // console.log('sending on givePlayers', cur);
      if(Object.keys(cur).length === 0) {
        console.log('sending empty player oh no!!!');
      } else if (cur.playerId === null || cur.playerId === undefined) {
        console.log('inside of give players, playerId is undefined', cur);
      } else {
        socket.emit('createMultiplayer', {  // 11.11.11.11.11.11.11.11.11.11.11
          x: cur.x,
          y: cur.y,
          playerId: cur.playerId,
          tint: cur.tint,
          playerName: cur.playerName
        });
      }
    });
  });

  socket.on('clientUpdate', function (data) {  // 14.14.14.14.14.14.14.14.14.14
    socket.broadcast.emit('multiplayerUpdate', data);
  });

  socket.on('disconnect', function(data) {
    console.log('disconnect event triggered', data, JSON.stringify(data));
  });
});
