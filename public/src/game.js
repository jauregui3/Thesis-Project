var testVar = 'client var';

function preload() {
  game.load.image('background', 'asset/tileBackground.png');
  game.load.image('blue-square', 'asset/sprites/blue-square.png');
  game.load.image('green-triangle', 'asset/sprites/green-triangle.png');
  game.load.image('red-circle', 'asset/sprites/red-circle.png');
}

var cursors;
var background;
var sprite;

function create() {
  width = 600;
  height = 600;
  game.stage.backgroundColor = '#2d2d2d';


  game.physics.startSystem(Phaser.Physics.P2JS);

  //  Make our game world 2000x2000 pixels in size (the default is to match the game size)
  game.world.setBounds(0, 0, 2000, 2000);


  background = game.add.tileSprite(-width, -height, game.world.width, game.world.height, 'background');
  background.fixedToCamera = true;

  // in future cache image in var and only set random x-y in loop
  for (var i = 0; i < 50; i++)
  {
    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'blue-square');
    sprite.scale.x = .5;
    sprite.scale.y = .5;

    sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'green-triangle');
    sprite.scale.x = .5;
    sprite.scale.y = .5;
  }
  sprite = game.add.sprite(400 , 300, 'red-circle');
  sprite.animations.add('run');
  sprite.animations.play('run', 15, true);
  game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

  cursors = game.input.keyboard.createCursorKeys();

  game.physics.p2.enable(sprite);

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

}

function render() {

  game.debug.cameraInfo(game.camera, 32, 32);

}

module.exports = testVar;