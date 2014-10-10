/**
 * File: shapes.js
 * Deps: Gyes, DOM, HapticModuleDriver
 *
 * Description: A "mini" game multimodality demo app.
 */

var ShapesApp = (function( interactive, gyes, doc, HapticMD, AirPointerMD ){
  // ***
  // Private module implementation
  // ***
  var self = this,
    _client,
    _fission,
    _fusion,
    elem;


  function _init(){
    console.log( 'INITIALIAZING SHAPES APP...' );
    // *** Set up interactive.js ***
    interactive.draggables( '.draggable' );
    interactive.droppables( '.droppable', { 'accept':'.draggable' } );

    // Setup AirPointerDriver events hooks
    // TODO: separate this, do something like replicate interactive api
    doc.addEventListener( 'fingerdown', function( ev ){
      console.log( 'finger is down! - ', ev );
    });

    var fingerDraggable = doc.querySelector( '.draggable' ).parentElement;
    doc.addEventListener( 'fingermove', function( ev ){
      var target = ev.target;
      var min = Math.min;
      var max = Math.max;
      console.info( 'fingermove::ev ', ev );
      if ( !target || !target.classList.contains('draggable') ){
        return;
      }

      if ( ev.detail ){
        ev.dx = parseInt( ev.detail.dx ) - target.offsetLeft;
        ev.dy = parseInt( ev.detail.dy ) - target.offsetTop;
      }

      //target.x = (( target.x|0 ) + ev.dx );
      target.x = ev.dx - (22*4);

      //target.y = (( target.y|0 ) + ev.dy );
      target.y = ev.dy - (22*4);

      target.style.top = target.y + 'px';
      target.style.left = target.x + 'px';

      target.style.webkitTransform = target.style.transform =
      'translate(' + target.x + 'px, ' + target.y + 'px)';
    });

    var fingerDroppable = doc.querySelector( '.droppable' ).parentElement;
    fingerDroppable.addEventListener( 'fingerenter', function( ev ){
      var target = ev.target;
      var src = ev.detail.src;
      if ( src.innerText === target.innerText ){
        target.classList.add( 'match' );
        setTimeout(function(){
          target.classList.remove( 'match' );
        }, 2000);
      }
      target.classList.add( 'onDropZone' );
    });

    fingerDroppable.addEventListener( 'fingerleave', function( ev ){
      var target = ev.target;

      target.classList.remove( 'onDropZone' );
    });

    // ***
    // SETUP GYES STUFF
    // ***
    //var socketURI = 'ws://0.0.0.0:26060';
    var socketURI = 'ws://plusultra-148603.sae1.nitrousbox.com:8080/';
    var options ={
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
      'element': doc.getElementById('shapes')//'.droppable'
    };

    var hapticDriver = new HapticMD( driverOptions );
    hapticMod.use( hapticDriver );
    _client.addModality( app_key, hapticMod );

    // ***
    // Interpretation, Fusion & the Fission
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
    // listen for interpretation to happen

    // Interaction elements
    var gestElem = doc.querySelector('.data-indicator');
    var gestName = doc.querySelector('.data-label');
    var gestNameAll = doc.querySelectorAll('.data-label');
    var gestData = doc.querySelector('.gesture-data');
    var gestDataText = gestData.querySelector( 'h3' );
    var fussionEl;
    var itemOff;
    var itemOn;

    _fusion.on( 'fusion::onSignal', function(data){
      console.log('doing fusion');
      gestName.textContent = '';
      gestElem.classList.remove( 'highlight' );
      gestName.textContent = data.gesture;
      gestElem.classList.add( 'highlight' );

      fussionEl = doc.getElementById( data.elementID );

      /*if ( fussionEl ){
        fussionEl.classList.add( 'onDropZone' );
      }*/

      setTimeout(function(){
        gestElem.classList.remove( 'highlight' );

        gestName.textContent = '';
      }, 2000);

    });

    _fission.on( _gestureInterpretation.getName(), function(data){
      console.log( 'A new interpretation happened: ', data );
      for ( var j=0; j<gestNameAll.length; j++ ){
        gestNameAll[ j ].textContent = '';
      }

      if ( fussionEl ){

      }

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