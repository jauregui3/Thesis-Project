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
  // console.log('emiting playerId');
  players.push({id: socket.id});

  socket.on('disconnectingUser', function(id) {
    console.log('disconnecting user id is: ', id);
  })

  socket.emit('playerId', {
    playerId: players[players.length - 1].id
  });
  // console.log('pushing new player to array');
  socket.on('clientUpdate', function (data) {
    //console.log('client update',data, players);
    socket.broadcast.emit('multiplayerUpdate', data);
  });

  socket.on('createBot', function (data) {
    console.log('createBot', data);
    var index = players.findIndex(function(item) {
      return item.id === data.playerId;
    });

    players[index].x = data.x;
    players[index].y = data.y;
    players[index].tint = data.tint;

    // players[data.playerId] = data;

    // add x, y, and tint for this player entry

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
      // console.log('sending on givePlayers', cur);
      if(Object.keys(cur).length === 0) {
        console.log('sending empty player oh no!!!');
      } else if (cur === null || cur === undefined) {
        console.log('inside of give players, playerId is undefined', cur);
      } else {
          socket.emit('createMultiplayer', {
            x: cur.x,
            y: cur.y,
            playerId: cur.playerId,
            tint: cur.tint
          });
        }
      });
  });

  socket.on('disconnect', function(data) {
    console.log('disconnect event triggered', data, JSON.stringify(data));
    //take out of active list
  });

});

module.exports = testVar;