/**
 * Module dependencies
 *
 */

var express = require('express');
var jade = require('jade');
var stylus = require('stylus');
var nib = require('nib');
var io = require('socket.io');
var http = require('http');

/**
 * Module locals
 *
 */
var app = require('express')();
var server = require('http').Server(app);
var pub = __dirname + '/public';
var sio;

/**
 * Module setup
 */

function compile(str, path){
  return stylus(str)
  .set('filename', path)
  .set('compress', true)
  .use(nib());
}

app.use( stylus.middleware({
  src: pub,
  compile: compile
}));
app.set('view engine', 'jade');
app.use( express.static(pub) );

/**
 * Module routes
 */

app.get('/', function(req, res){
  res.render( 'shapes', {'title':'Shapes App'} );
});

if ( app.env === 'development' ){
  app.use(function(err, req, res, next) {
    res.send( err.stack );
  });
}

server.listen(9290, 'localhost');

/**
 * Module Socket.io events
 */

sio = io(server)
  //.set('transports', ['websocket'])
  .sockets.on('connection', function( socket ){

    socket.on('data', function( msg ){
      socket.broadcast.emit( 'message', msg );
    });
  });
