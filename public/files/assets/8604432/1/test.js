var Network = pc.createScript('network');

// initialize code called once per entity
Network.prototype.initialize = function() {
    //this.socket = io('http://localhost:3000');
    this.socket = io('localhost:8081');
    this.socket.emit('initialize');
    var self = this;

    this.player = this.app.root.findByName ('Player');
    this.other = this.app.root.findByName ('Other');

    this.socket.on('playerData', function(data) {
        self.initializePlayers(data);
    });

    this.socket.on('playerJoined', function(data) {
        self.addPlayer(data);
    });

    this.socket.on ('playerMoved', function (data) {
        self.movePlayer (data);
    });
};

Network.prototype.initializePlayers = function(data) {
    this.players = data.players;
    this.id = data.id;
    this.player.id = data.id;

    for (var i = 0; i < this.players.length; i++) {
        if (i !== this.id) {
            this.players[i].entity = this.createPlayerEntity (data.players[i]);
        }
    }

    this.initialized = true;
};

Network.prototype.addPlayer = function(data) {
    this.players.push (data);
    this.players[this.players.length - 1].entity = this.createPlayerEntity (data);
};

Network.prototype.createPlayerEntity = function(data) {
    var newPlayer = this.other.clone();

    newPlayer.enabled = true;
    newPlayer.id = data.id;
    newPlayer.lastCollision = null;

    this.other.getParent().addChild(newPlayer);
    if (data.x & data.y & data.z) {
        // console.log('data', data);
        // console.log('newPlayer', newPlayer);
        // console.log('newPLayer.rigidBody', newPlayer.rigidBody);
        newPlayer.rigidbody.teleport(data.x, data.y, data.z);
    }
    // console.log(newPlayer);
    return newPlayer;
};

Network.prototype.movePlayer = function (data) {
    if (this.initialized) {
        this.players[data.id].entity.rigidbody.teleport(data.x, data.y, data.z);
    }
};

// update code called every frame
Network.prototype.update = function(dt) {
    this.updatePosition ();
};

Network.prototype.updatePosition = function () {
    if (this.initialized) {
        var pos = this.player.getPosition();
        // console.log(this.player);
        this.socket.emit ('positionUpdate', {id: this.id, x: pos.x, y: pos.y, z: pos.z});
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Network.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
