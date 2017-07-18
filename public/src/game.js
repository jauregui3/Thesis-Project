var testVar = 'client var';
// module.exports = testVar; weird behavior
var window = (window) ? window : global;

window.multiPlayers = {};
window.multiPlayers['textSprites'] = {};

var TEXTOFFSETX = 0;
var TEXTOFFSETY = 50;
var MPTEXTOFFSETX = 23;
var MPTEXTOFFSETY = 23;
var socket;
var playerId;
var playerTint;
var playerTextStyle = { font: "12px Arial", fill: "#ff0044", wordWrap: false };
var cursors;
var background;
var sprite;
var text;
var randX;
var randY;

//_____________________________________________________________________________
// Main Game Functions

function preload() {
  game.load.image('background', 'asset/tileBackground.png');
  game.load.image('blue-square', 'asset/sprites/blue-square.png');
  game.load.image('green-triangle', 'asset/sprites/green-triangle.png');
  game.load.image('red-circle', 'asset/sprites/red-circle.png');
}

function create() {
  if (true) {
    width = 0;
    height = 0;
    game.stage.backgroundColor = '#FF69B4';
    game.world.setBounds(0, 0, 1920, 1920);
    game.physics.startSystem(Phaser.Physics.P2JS);
    background = game.add.tileSprite(-width, -height, game.world.width, game.world.height, 'background');
    background.fixedToCamera = true;

    for (var i = 0; i < 50; i++) {
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
    }
    sprite = game.add.sprite(400 , 300, 'red-circle');
    sprite.scale.x = .75;
    sprite.scale.y = .75;
    sprite.tint = randomTint();
    playerTint = sprite.tint;
    text = game.add.text(230, 420, playerName, playerTextStyle);
    text.anchor.set(0.5);
    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON);
    cursors = game.input.keyboard.createCursorKeys();
    game.physics.p2.enable(sprite);
  }

  socket = window.io(); // 1111111111111111111111111111111111111111111111111111

  socket.on('playerId', function(data) { // 44444444444444444444444444444444444
    playerId = data.playerId;
    window.multiPlayers[playerId] = sprite;
    window.multiPlayers['textSprites'][playerId] = text;

    socket.emit('createBot', { // 555555555555555555555555555555555555555555555
      x: sprite.x,
      y: sprite.y,
      playerId: playerId,
      tint: sprite.tint,
      playerName: playerName
    });
  });

  // 88888888888888888888888888 || (end initialization) 12.12.12.12.12.12.12.12
  socket.on('createMultiplayer', function(data) {
    if (Object.keys(data).length === 0) {
      console.log('logging from game.js line 95');
    } else {
      getSprite(data.playerId, data);
    }
  });

  //  (part of update loop)  15.15.15.15.15.15.15.15.15.15.15.15.15.15.15.15.15
  socket.on('multiplayerUpdate', function(data) {
    var curSprite = getSprite(data.playerId, data);
    var textSprite = window.multiPlayers['textSprites'][data.playerId];
    textSprite.x = data.x + TEXTOFFSETX + MPTEXTOFFSETX;
    textSprite.y = data.y + TEXTOFFSETY + MPTEXTOFFSETY;
    curSprite.x = data.x;
    curSprite.y = data.y;
  });

  socket.emit('givePlayers', {}); // 999999999999999999999999999999999999999999
}

// (update loop emits 'clientUpdate') 13.13.13.13.13.13.13.13.13.13.13.13.13.13
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
  text.x = Math.floor(sprite.x + TEXTOFFSETX);
  text.y = Math.floor(sprite.y + TEXTOFFSETY);
}

function socketUpdateTransmit(x, y) {
  socket.emit('clientUpdate', {
    x: x,
    y: y,
    playerId: playerId,
    tint: playerTint,
    playerName: playerName
  });
};

function render() {/* game.debug.cameraInfo(game.camera, 32, 32);*/}

//_____________________________________________________________________________
// Other Functions

function randomTint() {
  return Math.random() * 0xffffff;
}

function getSprite(playerIdToCheck, data) {
  if (window.multiPlayers.hasOwnProperty(playerIdToCheck) === false) {
    var newSprite = initBot(data.x, data.y, 'red-circle', data.tint);
    window.multiPlayers[playerIdToCheck] = newSprite;
    var textSprite = game.add.text(data.x, data.y, data.playerName, playerTextStyle);
    window.multiPlayers['textSprites'][playerIdToCheck] = textSprite;
    return newSprite;
  } else {
    return window.multiPlayers[playerIdToCheck];
  }
}

function initBot(x, y, id, tint) {
  var tempSprite = game.add.sprite(x, y, id);
  tempSprite.tint = tint;
  tempSprite.scale.x = 0.75;
  tempSprite.scale.y = 0.75;
  return tempSprite;
}

module.exports = testVar;
