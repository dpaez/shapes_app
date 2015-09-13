var InteractiveApp = (function( interact ){


  function defaultMove( event ){
    var target = event.target;

    target.x = (target.x|0) + event.dx;
    target.y = (target.y|0) + event.dy;

    target.style.left = target.x + 'px';
    target.style.top = target.y + 'px';
    target.style.webkitTransform = target.style.transform =
    'translate(' + target.x + 'px, ' + target.y + 'px)';

  }

  function defaultDragEnter( event ){
    var target = event.target;
    target.classList.add( 'onDropZone' );
  }

  function defaultDragLeave( event ){
    var target = event.target;
    target.classList.remove( 'onDropZone' );
  }

  function setDrags( elements, options ){
    elements = elements || '.draggable';
    options = options || {};
    var onDragStartFn = options.onDragStartFn || undefined;
    var onDragMoveFn = options.onDragMoveFn || defaultMove;
    var onDragEndFn = options.onDragEndFn || undefined;

    interact( elements )
      .draggable({
        inertia: true,
        onstart: onDragStartFn,
        onmove: onDragMoveFn,
        onend: onDragEndFn
      })
  }

  function setDrops( elements, options ){
    elements = elements || '.droppable';
    options = options || {};
    var onDragEnterFn = options.onDragEnterFn || defaultDragEnter;
    var onDragLeaveFn = options.onDragLeaveFn || defaultDragLeave;
    var onDropFn = options.onDropFn || undefined;
    var accepts = options.accept || '.draggable';

    interact( elements )
      .dropzone( true )
      .on( 'dragenter', onDragEnterFn )
      .on( 'dragleave', onDragLeaveFn )
      .accept( accepts );
  }

  function publicDraggables( elementsList, options ){
    setDrags( elementsList, options );
  }

  function publicDroppables( elementsList, options ){
    setDrops( elementsList, options );
  }

  return{
    draggables: publicDraggables,
    droppables: publicDroppables
  };

})( interact );