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

var activePlayers = {};

io.on('connection', function(socket) { // 2222222222222222222222222222222222222
  activePlayers[socket.id] = {id: socket.id};
  console.log('someone new joined! Current list: ', activePlayers);

  socket.to(socket.id).emit('joinedGame', { // 33333333333333333333333333333333
    ownEntry: activePlayers[socket.id]
  });

  socket.on('initializeSelf', function (singleUserData) { // 666666666666666666
    activePlayers[singleUserData.id] = singleUserData;
    socket.broadcast.emit('activeUsersUpdate', singleUserData); // 777777777777
  });

  // 10.10.10.10.10.10.10.10.10.10.10.10.10
  socket.on('listOfUsersFromAClient', function (activeUsersFromAClient) {

    // every time someone joins they will reset all the players?
    for (var user in activeUsersFromAClient) {
      activePlayers[user.id] =  user;
    }

    for (var player in activePlayers) {
      socket.emit('activeUsersUpdate', player);   // 11.11.11.11.11.11.11.11.11
    }
  });

  socket.on('clientUpdate', function (oneClientsOwnData) {    // 14.14.14.14.14
    socket.broadcast.emit('multiplayerUpdate', oneClientsOwnData);
  });

  socket.on('disconnect', function(data) {
    console.log('disconnect event triggered', data, JSON.stringify(data));
  });
});
