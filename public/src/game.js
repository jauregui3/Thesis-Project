Game = function(game) {}

Game.prototype = {
    preload: function() {

        //load assets
      this.game.load.image('background', 'asset/tileBackground.png');
    },
    create: function() {
        var width = this.game.width;
        var height = this.game.height;
        console.log(this.game.world);

        this.game.world.setBounds(-width, -height, width*2, height*2);
        // this.game.stage.backgroundColor = '#d3d3d3';
        var background = this.game.add.tileSprite(-width, -height, this.game.world.width, this.game.world.height, 'background');
        this.game.camera.height = 500;
        this.game.camera.width = 500;

        this.game.camera.position = new Phaser.Point(1000, 1000);
    },
    /**
     * Main update loop
     */
    update: function() {
    }
};
