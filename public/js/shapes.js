var ShapesApp = (function( two, gyes, doc, HapticMD ){

  // Private module implementation
  var self = this,
    _two = null,
    _rect = null,
    _rectHome = null,
    _body,
    _elem,
    _client,
    _fission,
    _fusion;

  function _init(){
    console.log( 'INITIALIAZING SHAPES APP...' );

    // hardcoded

    _body = doc.body;
    // SETUP TWO STUFF
    _two = new Two({
      fullscreen: true,
      autostart: true
    });

    _two.appendTo( _body );

    _rect = _two.makeRectangle( _two.width / 4, _two.height / 4, 50 ,50 );
    _rectHome = _two.makeRectangle( _two.width / 1.5, _two.height / 4, 50 ,50 );
    _rectHome.fill = 'black';

    _two.update();

    _elem = doc.getElementById( 'two-1' );
    _elemHome = doc.getElementById( 'two-2' ); //doc.getElementsByClassName( 'rectHome' )[0];

    // SETUP GYES STUFF
    var socketURI = 'ws://0.0.0.0:26060';
    var options ={
      // transports: ['websocket'],
      'force new connection': true,
      'forceNew': true
    };
    var app_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjEzOTc0MjAzMDJ9.YPN191cpYko9Q_-9AtrOCwGBT6FQU---EduJTJki4zM';
    _client = new gyes( app_key, socketURI, options );

    _client.authenticate( app_key );

    // *** Creating a new modality ***

    var hapticMod = new gyes.Modality( 'webHaptic', 'both', {} );
    var driverOptions = {
      'hapticEvents': [ 'touch, hold' ],
      'element': _elem
    };

    var hapticDriver = new HapticMD( driverOptions );

    hapticMod.use( hapticDriver );

    _client.addModality( app_key, hapticMod );

    // *** Interpretation, Fusion & the Fission ***

    // swipe is the modality signal that is dispatched through the (Leap) Modality Driver
    _gestureInterpretation = new gyes.Interpretation( ['swipe', 'hold'] );
    _gestureInterpretation.canSynthetize( hapticMod.name, hapticDriver.getID(), 2000 );

    // create a fusion module
    _fusion = new gyes.Fusion( {'verbose':true} );
    // listen for some events
    _fusion.fuse( _gestureInterpretation );
    // create a fission module
    _fission = new gyes.Fission();
    // listen for interpretation to happen
    _fission.on( _gestureInterpretation.getName(), function(data){
      console.log( 'A new interpretation happened: ', data );

      var temp = _rect.fill;

      _rect.fill = 'green';

      setTimeout(function(){
        _rect.fill = temp;
      }, 2000);

    });

    var gestElem = doc.getElementsByClassName('data-indicator')[0];
    var gestName = doc.getElementsByClassName('data-label')[0];
    _fusion.on( 'fusion::onSignal', function(data){
      gestElem.classList.add( 'highlight' );
      gestName.textContent = data.gesture;
      setTimeout(function(){
        gestElem.classList.remove( 'highlight' );
        gestName.textContent = '';
      }, 2000);
    });

  }

  function _defaultFn( e ){

    e.gesture.stopPropagation();
    e.gesture.preventDefault();
    e.stopPropagation();
    e.preventDefault();
    var target = e.gesture.target;
    var x = parseInt(e.gesture.deltaX);
    var y = parseInt(e.gesture.deltaY);
    _rect.translation.set( x, y );
    //target.style.top = x + 'px';
    //target.style.left = y + 'px';

  }
  // Public API

  function publicInit(){
    _init();
  }

  return {
    initialize: publicInit
  };

})( Two, gyes, document, HapticModalityDriver );