var testVar = 'client var';

var socket;
var window = (window) ? window : global;
window.multiPlayers = {};
var playerId;
var playerTint;
//var playerName = document.getElementById("nameInput").value;//this may be where we begin tracking playername
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function socketUpdateTransmit(x, y) {
  socket.emit('clientUpdate', {
    x: x,
    y: y,
    playerId: playerId,
    tint: playerTint
    //playerName: playerName// may need to emit playerName
  });
};

function randomTint() {
  return Math.random() * 0xffffff;
}

function preload() {
  console.log('preload');
  game.load.image('background', 'asset/tileBackground.png');
  game.load.image('blue-square', 'asset/sprites/blue-square.png');
  game.load.image('green-triangle', 'asset/sprites/green-triangle.png');
  game.load.image('red-circle', 'asset/sprites/red-circle.png');
}

var cursors;
var background;
var sprite;
var text; //create var text for playerName or whatever we want...
var randX;
var randY;

function getSprite(playerIdToCheck, data) {
  if (window.multiPlayers.hasOwnProperty(playerIdToCheck) === false) {
    //create sprite
    var newSprite = initBot(data.x, data.y, 'red-circle', data.tint, data.playerName);
    var textSprite =
    window.multiPlayers[playerIdToCheck] = newSprite;
    return newSprite;
    //return sprite
  } else {
    return window.multiPlayers[playerIdToCheck];
  }
};

function create() {
  width = 0;
  height = 0;
  game.stage.backgroundColor = '#FF69B4';

  game.world.setBounds(0, 0, 1920, 1920);

  game.physics.startSystem(Phaser.Physics.P2JS);

  background = game.add.tileSprite(-width, -height, game.world.width, game.world.height, 'background');
  background.fixedToCamera = true;

  // in future cache image in var and only set random x-y in loop
  for (var i = 0; i < 50; i++)
  {
    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'blue-square');
    sprite.scale.x = .5;
    sprite.scale.y = .5;

    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'green-triangle');
    sprite.scale.x = .40;
    sprite.scale.y = .40;
    game.physics.p2.enable(sprite);
    sprite.body.data.damping = -.5;

    randX = Math.floor(Math.random() * 100 + 300);
    if (Math.random() > .5) {
      randX = -randX;
    }
    randY = Math.floor(Math.random() * 100 + 300);
    if (Math.random() > .5) {
      randY = -randY;
    }

    sprite.body.velocity.x = randX;
    sprite.body.velocity.y = randY;
    // sprite.body.
  }

  sprite = game.add.sprite(400 , 300, 'red-circle');
  sprite.scale.x = .75;
  sprite.scale.y = .75;
  sprite.tint = randomTint();
  playerTint = sprite.tint;

  var style = { font: "12px Arial", fill: "#ff0044", wordWrap: false }; //removed backgroundColor: "#ffff00 wordWrapWidth: sprite.width, , align: "center"

    text = game.add.text(230, 420, playerName, style);
    text.anchor.set(0.5);
    //sprite.addChild(text);

  game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON);
  //game.playerName.follow(sprite)
  cursors = game.input.keyboard.createCursorKeys();
  game.physics.p2.enable(sprite);

  socket = window.io();

  socket.on('playerId', function(data) {
    // console.log('playerId event handler triggered');
    playerId = data.playerId;
    // console.log('setting multiPlayers: ', playerId);
    window.multiPlayers[playerId] = sprite;
    window.multiPlayers['textSprites'][playerId] = text;
    socket.emit('createBot', {
      x: sprite.x,
      y: sprite.y,
      playerId: playerId,
      tint: sprite.tint,
      playerName: playerName
    });
  });

  socket.on('createMultiplayer', function(data) {
    // console.log('createMultiplayer data=', data);
    if (Object.keys(data).length === 0) {
      console.log('create multiplayer empty object OH NO!!!!!!!');
    } else {
      // console.log('createMultiplayer: ', data);
      getSprite(data.playerId, data);
      /*
      if (window.multiPlayers.hasOwnProperty(data.playerId) === false ) {
        console.log('no sprite with that Id exists --- creating');
        var newSprite = initBot(data.x, data.y, 'red-circle', data.tint);
        window.multiPlayers[data.playerId] = newSprite;
      }
      */
    }
    // console.log('end of createMultiplayer');
  });

  socket.on('multiplayerUpdate', function(data) {
    // console.log('multiplayerUpdate: ', data, window.multiPlayers);
    var curSprite = getSprite(data.playerId, data);
    curSprite.x = data.x;
    curSprite.y = data.y;
  });

  socket.emit('givePlayers', {});
}

function initBot(x, y, id, tint, newPlayerName) {
  if (!newPlayerName) {
    newPlayerName = 'NONCUSTOM USER LOL';
  }
  //var personGroup = game.addGroup();
  var tempSprite = game.add.sprite(x, y, id);
  tempSprite.tint = tint;
  tempSprite.scale.x = 0.75;
  tempSprite.scale.y = 0.75;

  return tempSprite;
}


function update() {
  sprite.body.setZeroVelocity();

  if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
    sprite.body.moveUp(550);
  } else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
    sprite.body.moveDown(550);
  } if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    sprite.body.moveLeft(550);
  } else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
    sprite.body.moveRight(550);
  }

  if (!game.camera.atLimit.x) {
    background.tilePosition.x -= ((sprite.body.velocity.x) * game.time.physicsElapsed);
  }
  if (!game.camera.atLimit.y) {
    background.tilePosition.y -= ((sprite.body.velocity.y) * game.time.physicsElapsed);
  }
  if (playerId === null || playerId === undefined) {

  } else {
    socketUpdateTransmit(sprite.body.x, sprite.body.y);
  }
  //below anchoring text to sprite functionality testing????
  text.x = Math.floor(-37 + sprite.x + sprite.width / 2);
  text.y = Math.floor(sprite.y + sprite.height - 20);//text.y = Math.floor(sprite.y + sprite.height / 2);
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
}

module.exports = testVar;
