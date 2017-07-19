var testVar = 'client var';
// module.exports = testVar; weird behavior
var window = (window) ? window : global;
var activeUsers = {};
var socket;
var sprite;
var cursors;
var background;
var text;
var SOCKETID;

window.onbeforeunload = function () {
  socket.emit('disconnectingUser', {id: SOCKETID});
}

function preload() {
  game.load.image('background', 'asset/tileBackground.png');
  game.load.image('blue-square', 'asset/sprites/blue-square.png');
  game.load.image('green-triangle', 'asset/sprites/green-triangle.png');
  game.load.image('red-circle', 'asset/sprites/red-circle.png');
}

function create() {
  game.world.setBounds(0, 0, 1920, 1920);
  game.physics.startSystem(Phaser.Physics.P2JS);
  background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');
  background.fixedToCamera = true;

  for (var i = 0; i < 10; i++) {
    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'blue-square');
    sprite.scale.x = .5;
    sprite.scale.y = .5;

    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'green-triangle');
    sprite.scale.x = .40;
    sprite.scale.y = .40;
    game.physics.p2.enable(sprite);
    sprite.body.data.damping = -.5;
    var randX = Math.floor(Math.random() * 100 + 300);
    if (Math.random() > .5) {randX = -randX;}
    var randY = Math.floor(Math.random() * 100 + 300);
    if (Math.random() > .5) {randY = -randY;}
    sprite.body.velocity.x = randX;
    sprite.body.velocity.y = randY;
  }

  sprite = game.add.sprite(400 , 300, 'red-circle');
  sprite.scale.x = .75;
  sprite.scale.y = .75;
  sprite.tint = Math.random() * 0xffffff;
  text = game.add.text(230, 420, playerName, {font:"12px Arial",fill:"#ff0044",wordWrap:false});
  text.anchor.set(0.5);
  game.physics.p2.enable(sprite);

  game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON);

  socket = window.io();

  socket.on('connect', function() {
    SOCKETID = socket.id;

    activeUsers[socket.id] = sprite;
    activeUsers[socket.id].textSprite = text;
    socket.emit('registerUser', {
      id: socket.id,
      x: sprite.x,
      y: sprite.y,
      name: playerName,
      color: sprite.tint
    });
  });

  socket.on('updateClient', function(activePlayersFromServer) {
    // Weird behavior: When you use lines 146/147 (had them commented out for most of this)
    // they seem to attatch to the wrong user. The one I control has the other one's label?
    // Maybe this is a clue to why they are behaving weirdly, though I think it also might
    // be a limitation of trying to test on one PC where I can only focus one screen at a
    // time...

    for (var userProp in activePlayersFromServer) {
      if (!activeUsers[userProp]) {
        var userSprite;
        userSprite = game.add.sprite(activePlayersFromServer[userProp].x , activePlayersFromServer[userProp].y, 'red-circle');
        userSprite.scale.x = .75;
        userSprite.scale.y = .75;
        userSprite.tint = activePlayersFromServer[userProp].color;
        text = game.add.text(activePlayersFromServer[userProp].x, activePlayersFromServer[userProp].y,
          activePlayersFromServer[userProp].name, {font:"12px Arial",fill:"#ff0044",wordWrap:false});
        text.anchor.set(0.5);
        game.physics.p2.enable(userSprite);

        // add the sprite object to players
        activeUsers[userProp] = userSprite;
      } else if (userProp !== SOCKETID) {
        activeUsers[userProp].x = activePlayersFromServer[userProp].x;
        activeUsers[userProp].y = activePlayersFromServer[userProp].y;
      }
    }

    /* console.log(activePlayers) ->

      {
        X0uV0-99K3xfS4ydAAAA: {
                                color:9619787.497180868,
                                id:"X0uV0-99K3xfS4ydAAAA",
                                name:"asdf",
                                x:155.75522422790527,
                                y:761.0405731201172
                              },

        p8sNRFQS6lV3ICptAAAB: {
                                color:2403833.5947995456,
                                id:"p8sNRFQS6lV3ICptAAAB",
                                name:"1234",
                                x:158.40913772583008,
                                y:497.09022521972656
                              }
      }

    */
  });
}

function update() {
  cursors = game.input.keyboard.createCursorKeys();

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
  // offset text by 50
  text.x = Math.floor(sprite.x + 50);
  text.y = Math.floor(sprite.y + 50);

  // socket.emit('updateServer', activeUsers[SOCKETID]);
  socket.emit('updateServer', {
      id: socket.id,
      x: sprite.x,
      y: sprite.y,
      name: playerName,
      color: sprite.tint
    });
}

function render() {/* game.debug.cameraInfo(game.camera, 32, 32);*/}

module.exports = testVar;
