var socket = window.io();

var socketUpdateTransmit = function(x, y) {
  socket.emit('clientUpdate', {
    x: ,
    y: ,
  });
};