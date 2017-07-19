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
var activePlayers = {};

io.on('connection', function(socket) {
  socket.on('registerUser', function(newUser) {
    console.log('registering user: ', newUser.id);
    players[newUser.id] = newUser;
    //spawn in random position with random color
    var randX = Math.floor(Math.random() * 1600 + 50);
    var randY = Math.floor(Math.random() * 1600 + 50);
    players[newUser.id]['x'] = randX;
    players[newUser.id]['y'] = randY;
    players[newUser.id]['color'] = Math.random() * 0xffffff;
    console.log('end of player creation: ', players[newUser.id]);
  });

  socket.on('updateServer', function(oneUsersData) {
    players[oneUsersData.id] = oneUsersData;
  });


  socket.on('disconnectingUser', function(user) {
    // let setInterval clean it up
    players[user.id] = 'undefined';
  });
});

setInterval(function() {

  var keys = Object.keys(players);
  // console.log('keys are ', keys, players[keys[0]]);
  // remove the weird 'undefined' string key
  // not sure how it gets in there
  // but this seems to do the trick
  var index = keys.findIndex(key => {
      return key === 'undefined';
});
  if (index > -1) {
    keys.splice(index, 1);
  }
  //

  keys.forEach(key => {
    if (players[key] !== null) {
    activePlayers[key] = players[key];
  }
});
  // console.log('about to send these players', players, activePlayers);
  io.emit('updateClient', activePlayers);
}, 40);