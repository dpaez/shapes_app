'use strict';
/**
 * Module dependencies
 *
 */

const Path = require('path');
const Hapi = require('hapi');
const jade = require('jade');
const stylus = require('stylus');
const nib = require('nib');
const http = require('http');
const io = require('socket.io');





/**
 * Module locals
 *
 */
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
var pub = __dirname + '/public';
var sio;

/**
 * Module setup
 */

const plugins = [
    {
        register: require( 'vision' ),
        options: {}
    },
    {
        register: require('inert'),
        options: {}
    },
    {
        register: require( 'hapi-stylus' ),
        options: {
            home: __dirname + "/public/style",
            route: __dirname + "/public/style/{filename*}",
            use: [nib]
        }
    }
];

server.connection( { port: 9290 } );
server.register(plugins, (err) => {

    if (err) {
        throw err;
    }
    server.views({
        engines: { jade: require('jade') },
        path: __dirname + '/views',
        compileOptions: {
            pretty: true
        }
    });

    server.route( {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view( 'shapes', {'title':'Shapes App'} );
        }
    } );

    // static files route
    server.route( {
        method: 'GET',
        path: '/style/{param*}',
        handler: {
            directory: {
                path: 'style',
                listing: true
            }
        }
    } );

    server.route( {
        method: 'GET',
        path: '/js/{param*}',
        handler: {
            directory: {
                path: 'js'
            }
        }
    } );


    server.route( {
        method: 'GET',
        path: '/vendor/{param*}',
        handler: {
            directory: {
                path: 'vendor'
            }
        }
    } );


    /**
    * Module Socket.io events
    */

    sio = io(server.listener)
    //.set('transports', ['websocket'])
    .sockets.on('connection', function( socket ){

        socket.on('data', function( msg ){
            socket.broadcast.emit( 'message', msg );
        });
    });
    server.start( () => {
        console.log( 'Hapi :D Server running at: %s',
        server.info.uri );
    } );

});
