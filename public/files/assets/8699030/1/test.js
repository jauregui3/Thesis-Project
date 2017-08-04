var Network = pc.createScript('network');
var self;
Network.prototype.initialize = function() {
  self = this;
  this.player = this.entity;
  window.player = this.player;
  this.players = [];
  this.other = this.app.root.findByName('Other');

  if (window.socket === undefined) {
    window.socket = io('http://localhost:8081');
  }

  this.socket = window.socket;

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

Network.prototype.smrtInitialize = function() {
  this.socket = window.socket;
  this.socket.emit('initialize', self.player.nickName);
};

Network.prototype.initializePlayers = function(data) {
  this.players = data.players;
  window.players = this.players;
  this.id = data.id;
  this.player.id = data.id;

  for (var i = 0; i < this.players.length; i++) {
    if (i !== this.id && this.players[i] !== 'dead') {
      this.players[i].entity = this.createPlayerEntity (this.players[i]);
    }
  }
  this.initialized = true;
};

Network.prototype.addPlayer = function(data) {
  data.entity = this.createPlayerEntity(data);
  this.players.push(data);
};

Network.prototype.createPlayerEntity = function(data) {
  var doesIdExist;
  if (this.players) {
      doesIdExist = this.players.reduce(function(accum, cur) {
      if (cur.id === data.id) {
        accum = true;
      }
      return accum;
    }, false);
  }

  if (data !== undefined && data !== 'dead' && (doesIdExist === false || data.entity === null)) {
    var newPlayer = this.other.clone();

    newPlayer.enabled = true;
    newPlayer.id = data.id;
    newPlayer.nickName = data.nickName;
    newPlayer.lastCollision = null;
    this.other.getParent().addChild(newPlayer);
    if (data) {
      newPlayer.rigidbody.teleport(data.x, data.y, data.z);
    }
    return newPlayer;
  }
};

Network.prototype.movePlayer = function (data) {
  if (this.initialized && this.players[data.id] && this.players[data.id].entity) {
    this.players[data.id].entity.rigidbody.teleport(data.x, data.y, data.z);
    this.players[data.id].entity.rigidbody.linearVelocity = new pc.Vec3(data.vx, data.vy, data.vz);
    this.players[data.id].entity.rigidbody.angularVelocity = new pc.Vec3(data.ax, data.ay, data.az);
  }
};

Network.prototype.update = function(dt) {
  this.updatePosition ();
};

Network.prototype.updatePosition = function () {
  if (this.initialized) {
    var pos = this.player.getPosition();
    var lv = this.player.rigidbody.linearVelocity;
    var av = this.player.rigidbody.angularVelocity;
    if (self.id !== this.id) {
      console.log('id disparity in updatePosition');
    }
    this.socket.emit ('positionUpdate', {
      id: this.id,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      vx: lv.x,
      vy: lv.y,
      vz: lv.z,
      ax: av.x,
      ay: av.y,
      az: av.z
    });
  }
};
