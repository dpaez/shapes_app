/**
 * File: shapes.js
 * Deps: Gyes, DOM, HapticModuleDriver
 *
 * Description: A proof-of-concept multimodality game, built using plusultra engine.
 */

var ShapesApp = (function( interactive, gyes, doc, HapticMD, AirPointerMD ){
  // ***
  // Private module implementation
  // ***
  var self = this,
    _client,
    _fission,
    _fusion,
    elem,
    src,
    socket;

  function _init (){
    console.info( 'INITIALIAZING SHAPES APP...' );

    socket = io.connect('ws://shapes-app.geutstudio.com:8000');
    //socket = io.connect();

    // *** Set up interactive.js ***
    interactive.draggables( '.draggable' );
    interactive.droppables( '.droppable', { 'accept':'.draggable' } );

    // Setup AirPointerDriver events hooks
    // TODO: separate this, do something like replicate interactive api
    doc.addEventListener( 'fingerdown', function( ev ){
      console.log( 'finger is down! - ', ev );
    });

    var fingerDraggable = doc.querySelector( '.draggable' ).parentElement;

    // TODO: move me to interactive.js
    var updatePosition = function( id, posx, posy ){
      if ( !id ){ return; }
      var target = doc.getElementById( id );
      var dx, dy;
      console.log( 'updatePosition: ', target )
      if ( !target || !target.classList.contains('item') ){
        return;
      }

      dx = parseInt( posx ) - target.offsetLeft;
      dy = parseInt( posy ) - target.offsetTop;

      var bodyWidth = $( doc ).width();
      if ( bodyWidth >= 800 ){
        target.x = dx - 88;
        target.y = dy - 88;
      } else {
        target.x = dx - 98;
        target.y = dy - 98;
      }

      target.style.top = target.y + 'px';
      target.style.left = target.x + 'px';

      target.style.webkitTransform = target.style.transform =
      'translate(' + target.x + 'px, ' + target.y + 'px)';
    };

    function matchLetter ( element ){
      element.classList.add( 'match' );
      //element.setAttribute( 'matched', true );
      setTimeout( function () {
        element.classList.remove( 'match' );
        //element.setAttribute( 'matched', false );
      }, 2500);
    };

    function matchLocked (){
      var draggedEl, droppedEl, draggables;

      droppedEl = $( '.match' );
      if ( droppedEl && droppedEl.length ){
        //droppedEl = droppedEl[ 0 ];
        draggables = $( '.item' );
        for ( var i = 0; i < draggables.length; i++ ) {
          
          draggedEl = $( draggables[i] );
          if ( draggedEl && draggedEl.text() === droppedEl.text() ){
            break;
          }
          
        };

        console.log( 'droppedEl: ', droppedEl );
        console.log( 'draggedEl: ', draggedEl );
        if (draggedEl){
          draggedEl.hide();
        }
        droppedEl.addClass( 'item-match' );
      }

    };

    doc.addEventListener( 'fingermove', function( ev ){
      var posx = ev.detail.dx,
       posy = ev.detail.dy,
       id = ev.target.id,
       //id = ev.detail.src.id,
       originalW, originalH,
       over, target;

      updatePosition( id, posx, posy );
      if ( id ){
        src = doc.getElementById( id ); // update src
      }

      target = ev.target;
      over = doc.elementFromPoint( posx, posy - (target.clientWidth/2 + 1) );
      if ( over && (over.classList.contains( 'home' ) || over.id === 'shapes') ){
        originalW = doc.getElementById( 'shapes' ).clientWidth + target.clientWidth + 88;
        originalH = doc.getElementById( 'shapes' ).clientHeight + target.clientHeight + 88;
        socket.emit( 'data', {id:id, action: 'update', posx:posx, posy:posy, w:originalW, h:originalH} );
      }
    });

    socket.on('message', function( msg ){

      if ( msg.action === 'match' ){
        var target = doc.getElementById( msg.id );
        matchLetter( target );
        return;
      }else if ( msg.action === 'lock' ){
        matchLocked();
      }

      var shapesW,shapesH,scaleW,scaleH;

      shapesW = $( '#shapes' ).innerWidth();
      shapesH = $( '#shapes' ).innerHeight();
      scaleW = shapesW/msg.w;
      scaleH = shapesH/msg.h;

      updatePosition( msg.id, msg.posx * scaleW , msg.posy * scaleH );
    });

    var fingerDroppable = doc.querySelector( '.droppable' ).parentElement;
    fingerDroppable.addEventListener( 'fingerenter', function( ev ){
      var target = ev.target;

      if ( src && target && src.innerText === target.innerText ){
        matchLetter( target );
        socket.emit( 'data', {id:target.id, action: 'match'} );
      }
      target.classList.add( 'onDropZone' );

    });

    fingerDroppable.addEventListener( 'fingerleave', function( ev ){
      var target = ev.target;
      var src = ev.detail.src;
      target.classList.remove( 'onDropZone' );
    });

    // ***
    // SETUP GYES STUFF
    var socketURI = 'ws://plusultra.geutstudio.com';
    var options = {
      // transports: ['websocket'],
      'force new connection': true,
      'forceNew': true
    };
    var app_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjEzOTc0MjAzMDJ9.YPN191cpYko9Q_-9AtrOCwGBT6FQU---EduJTJki4zM';
    _client = new gyes( app_key, socketURI, options );

    _client.authenticate( app_key );

    // *** Creating a new modality ***

    var airMod = new gyes.Modality( 'airGestures', 'input', {} );
    var width = isNaN(window.innerWidth) ? doc.clientWidth : window.innerWidth;
    var height = isNaN(window.innerHeight) ? doc.clientHeight : window.innerHeight;
    var airOptions = {
      width: width,
      height: height
    };
    var airDriver = new AirPointerMD( width, height );
    airMod.use( airDriver );
    _client.addModality( app_key, airMod );

    // *** Creating a new modality ***

    var hapticMod = new gyes.Modality( 'webHaptic', 'both', {} );
    var driverOptions = {
      'hapticEvents': [ 'touch, hold' ],
      'element': doc.querySelector('.onDropZone')//'.droppable'
    };

    var hapticDriver = new HapticMD( driverOptions );
    hapticMod.use( hapticDriver );
    _client.addModality( app_key, hapticMod );

    // ***
    // Interpretation, Fusion & Fission
    // ***

    // fingerover is the modality signal that is dispatched through the (Leap) AirGestures
    _gestureInterpretation = new gyes.Interpretation( ['fingerover', 'hold'] );
    _gestureInterpretation.canSynthetize( hapticMod.name, hapticDriver.getID(), 2000 );

    // create a fusion module
    _fusion = new gyes.Fusion( {'verbose':true} );
    // listen for some events
    _fusion.fuse( _gestureInterpretation );
    // create a fission module
    _fission = new gyes.Fission();

    // Interaction elements
    var gestElem = doc.querySelector( '.data-indicator' );
    var gestName = doc.querySelector( '.data-label' );
    var gestNameAll = doc.querySelectorAll( '.data-label' );
    var gestData = doc.querySelector( '.gesture-data' );
    var gestDataText = gestData.querySelector( 'h3' );
    var fussionEl;
    var itemOff;
    var itemOn;

    // listen for interpretation to happen
    _fusion.on( 'fusion::onSignal', function(data){
      console.log( 'doing fusion' );
      gestName.textContent = '';
      gestElem.classList.remove( 'highlight' );
      gestName.textContent = data.gesture;
      gestElem.classList.add( 'highlight' );

      fussionEl = doc.getElementById( data.elementID );
      if ( fussionEl ){
        fussionEl.classList.add( 'onDropZone' );
      }

      setTimeout(function(){
        gestElem.classList.remove( 'highlight' );
        if ( fussionEl ){
          fussionEl.classList.remove( 'onDropZone' );
        }
        gestName.textContent = '';
      }, 2000);

    });

    _fission.on( _gestureInterpretation.getName(), function(data){
      console.log( 'A new interpretation happened: ', data );
      for ( var j=0; j<gestNameAll.length; j++ ){
        gestNameAll[ j ].textContent = '';
      }

      matchLocked();
      socket.emit( 'data', {id:'', action: 'lock'} );

      gestElem.classList.remove( 'highlight' );
      gestDataText.classList.remove( 'invisible' );
      gestDataText.textContent = 'FISION';
      gestData.classList.add( 'highlight' );
      setTimeout(function(){
        gestDataText.classList.add( 'invisible' );
        gestData.classList.remove( 'highlight' );
        gestDataText.textContent = '';
      }, 2000);
    });
  }

  // ***
  // Public API
  // ***

  function publicInit(){
    _init();
  }

  return {
    initialize: publicInit
  };

})( InteractiveApp, gyes, document, HapticModalityDriver, AirPointerModalityDriver );
