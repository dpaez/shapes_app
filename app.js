/**
 * Module dependencies
 *
 */

var express = require('express');
var jade = require('jade');
var stylus = require('stylus');

/**
 * Module locals
 *
 */
var app = express();
var pub = __dirname + '/public';

/**
 * Module setup
 */

function compile(str, path){
  return stylus(str)
  .set('filename', path)
  .set('compress', true);
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

app.listen(3000, '0.0.0.0');