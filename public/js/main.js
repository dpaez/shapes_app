(function( $, app, visor ){

  var height = $( window ).height();

  function preInit ( ) {
    // adjust app window height
    $( document.body ).height( height );
    //if ( window.matchMedia('handheld, (max-width: 750px)').matches ){
    console.log( 'current height: ', height );
    var letterH = height/4;
    $( '.item, .item-off' ).height( letterH );
    $( '.item, .item-off' ).css( 'font-size', letterH );
    $( '.item, .item-off' ).css( 'line-height', 1 );
    init();
  };

  function init (){
    // init all the modules
    app.initialize();
    visor.start();
    postInit();
  };

  function postInit(){
    // postInit()
    if ( window.matchMedia('handheld, (max-width: 750px)').matches ){
      var forms = document.querySelectorAll( '.draggable' );
      for ( var i = forms.length - 1; i >= 0; i-- ) {
        forms[ i ].classList.remove( 'draggable' );
      }
    }
  };


  function start( ) {
    preInit();
  }

  start();

}( jQuery, ShapesApp, Visor ));