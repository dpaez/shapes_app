(function( app, visor ){

  app.initialize();
  visor.start();
  if ( window.matchMedia('handheld, (max-width: 750px)').matches ){
    var forms = document.querySelectorAll( '.draggable' );
    for ( var i = forms.length - 1; i >= 0; i-- ) {
      forms[ i ].classList.remove( 'draggable' );
    }
  }
  /*var disableDD = function(){
    var forms = document.querySelectorAll( '.draggable' );
    if ( document.body <= 800 ){
      for (var i = forms.length - 1; i >= 0; i--) {
        forms[ i ].classList.remove( 'draggable' );
      };
    }
  }*/

  /*document.body.addEventListener( 'resize', disableDD );
  disableDD();*/
}( ShapesApp, Visor ));