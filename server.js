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

var players = {};

io.on('connection', function(socket) {
  socket.on('registerUser', function(newUser) {
    players[newUser.id] = newUser;
  });

  socket.on('updateServer', function(oneUsersData) {
    players[oneUsersData.id] = oneUsersData;
    // console.log(players);
  });


  setInterval(function() {
    var activePlayers = {};
    var keys = Object.keys(players);

    // remove the weird 'undefined' string key
    // not sure how it gets in there
    // but this seems to do the trick
    var index = keys.findIndex(key => {
      return key === 'undefined';
    });
    keys.splice(index, 1);
    // console.log('keys after splice: ', keys);

    keys.forEach(key => {
      if (players[key] !== null) {
        activePlayers[key] = players[key];
      }
    });
    socket.emit('updateClient', activePlayers);
  }, 40);

  socket.on('disconnectingUser', function(user) {
    // let setInterval clean it up
    players[user.id] = 'undefined';
  });
});
