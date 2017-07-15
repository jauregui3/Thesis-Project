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
var randX;
var randY;

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
    console.log(sprite.body)
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


  game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON);

  cursors = game.input.keyboard.createCursorKeys();

  game.physics.p2.enable(sprite);

}

// figure out key aliases
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
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
}

module.exports = testVar;