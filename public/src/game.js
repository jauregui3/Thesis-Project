var testVar = 'client var';

var socket;
window.multiPlayers = {};
var playerId;
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function socketUpdateTransmit(x, y, id) {
  socket.emit('clientUpdate', {
    x: x,
    y: y,
    playerId: playerId
  });
};




function preload() {
  console.log('preload');
  game.load.image('background', 'asset/tileBackground.png');
  game.load.image('mushroom', 'asset/sprites/mushroom2.png');
  game.load.image('ball', 'asset/sprites/green_ball.png');
  game.load.atlasJSONHash('bot', 'asset/sprites/running_bot.png', 'asset/sprites/running_bot.json');
}

var cursors;
var background;
var sprite;


function create() {
  console.log('create');
  width = 600;
  height = 600;
  game.stage.backgroundColor = '#2d2d2d';


  game.physics.startSystem(Phaser.Physics.P2JS);

  //  Make our game world 2000x2000 pixels in size (the default is to match the game size)
  game.world.setBounds(0, 0, 2000, 2000);


  background = game.add.tileSprite(-width, -height, game.world.width, game.world.height, 'background');
  background.fixedToCamera = true;

  for (var i = 0; i < 150; i++)
  {
    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
  }
  /*
  sprite = game.add.sprite(400 , 300, 'bot');
  sprite.animations.add('run');
  sprite.animations.play('run', 15, true);
  changeTint();
  */
  sprite = initBot(400, 300, 'bot', randomTint());
  socket = window.io();

  socket.on('playerId', function(data) {
    console.log('playerId event handler triggered');
    playerId = data.playerId;
    console.log('setting multiPlayers: ', playerId);
    window.multiPlayers[playerId] = sprite;
    socket.emit('createBot', {
      x: sprite.x,
      y: sprite.y,
      playerId: playerId,
      tint: sprite.tint
    });
  });

  socket.on('createMultiplayer', function(data) {
    console.log('createMultiplayer data=', data);
    if (Object.keys(data).length === 0) {
      console.log('create multiplayer empty object');
    } else {
      console.log('createMultiplayer: ', data);
      if (window.multiPlayers.hasOwnProperty(data.playerId) === false ) {
        console.log('no sprite with that Id exists --- creating');
        var newSprite = initBot(data.x, data.y, 'bot', data.tint);
        window.multiPlayers[data.playerId] = newSprite;
      }
    }
    console.log('end of createMultiplayer');
  });

  socket.on('multiplayerUpdate', function(data) {
    // console.log('multiplayerUpdate: ', data, window.multiPlayers);
    window.multiPlayers[data.playerId].x = data.x;
    window.multiPlayers[data.playerId].y = data.y;
  });



  game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

  cursors = game.input.keyboard.createCursorKeys();

  game.physics.p2.enable(sprite);

  socket.emit('givePlayers', {});

}

function randomTint() {
  return Math.random() * 0xffffff;
}

function initBot (x, y, id, tint) {
  var tempSprite = game.add.sprite(x, y, id);
  tempSprite.tint = tint;
  tempSprite.animations.add('run');
  tempSprite.animations.play('run', 15, true);
  return tempSprite;
}



function update() {

  sprite.body.setZeroVelocity();

  if (cursors.up.isDown) {
    sprite.body.moveUp(300);
  }
  else if (cursors.down.isDown) {
    sprite.body.moveDown(300);
  }

  if (cursors.left.isDown) {
    sprite.body.moveLeft(300);
  }
  else if (cursors.right.isDown) {
    sprite.body.moveRight(300);
  }

  if (!game.camera.atLimit.x) {
    background.tilePosition.x -= ((sprite.body.velocity.x) * game.time.physicsElapsed);
  }
  if (!game.camera.atLimit.y) {
    background.tilePosition.y -= ((sprite.body.velocity.y) * game.time.physicsElapsed);
  }

  socketUpdateTransmit(sprite.body.x, sprite.body.y);
}

function render() {

  game.debug.cameraInfo(game.camera, 32, 32);

}

module.exports = testVar;