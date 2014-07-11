/**
 * File: Visor.js
 * Deps: -
 *
 * Description: A multimodality live data app. Made it to work with the plusultra platform.
 */

/** WIP **/

var Visor = (function( doc ){
  var lightBox = doc.createElement( 'aside' );
  lightBox.classList.add( 'lightbox' );
  var lightboxStartCheck = doc.createElement( 'input' );
  lightboxStartCheck.type = 'checkbox';
  lightboxStartCheck.name = 'startvisor';
  lightboxStartCheck.value = false;
  lightboxStartCheck.id = 'lightboxcheckboxstart';

  var lightboxStartLabel = doc.createElement( 'label' );
  lightboxStartLabel.htmlFor = 'lightboxcheckboxstart';
  lightboxStartLabel.appendChild(doc.createTextNode('Visor de estado: '));


  var visorEl = doc.getElementById( 'extra' );
  var gestElem = doc.querySelector( '.data-indicator' );
  var gestName = doc.querySelector( '.data-label' );

  /*_fusion.on( 'fusion::onSignal', function(data){
    gestElem.classList.add( 'highlight' );
    gestName.textContent = data.gesture;
    setTimeout(function(){
      gestElem.classList.remove( 'highlight' );
      gestName.textContent = '';
    }, 2000);
  });*/

  // *** Private API

  function setup(){
    lightboxStartCheck.addEventListener( 'change', showVisor, false );
  }

  function showVisor( event ){
    var target = event.target;
    var checked = target.checked || false;

    if ( checked ){
      visorEl.classList.remove( 'invisible' );
      visorEl.classList.add( 'statusEnabled' );
    }else{
      visorEl.classList.add( 'invisible' );
    }


  }

  function lightmenu(){
    lightBox.appendChild( lightboxStartLabel );
    lightBox.appendChild( lightboxStartCheck );
    doc.body.appendChild( lightBox );
    setup();
  }

  // *** Public API
  function publicLightMenu(){
    lightmenu();
  }

  return {
    start: publicLightMenu
  };

})( document );
