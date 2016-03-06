var InteractiveApp = (function( interact ){
  'use strict';


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
    console.log('defaultDragEnter::target', target)
    target.classList.add( 'onDropZone' );
  }

  function defaultDragLeave( event ){
    var target = event.target;
    console.log('defaultDragLeave::target', target)
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
    var accepts = options.accept || { accept: '.draggable' };
    var iOptions = {
        accept: '.draggable',
        overlap: 'center',
        checker: function (
            dragEvent,         // related dragmove or dragend
            event,             // Touch, Pointer or Mouse Event
            dropped,           // bool default checker result
            dropzone,          // dropzone Interactable
            dropElement,       // dropzone elemnt
            draggable,         // draggable Interactable
            draggableElement) {// draggable element
                 // only allow drops into empty dropzone elements
                 console.log( 'dropElement inner is equal to draggableElement', (dropElement.innerText === draggableElement.innerText))
                 return dropped && dropElement.innerText === draggableElement.innerText;
            }
    };

    interact( elements )
      .dropzone( iOptions )
    //   .on( 'dragenter', onDragEnterFn )
    //   .on( 'dragleave', onDragLeaveFn )
      //.accept( accepts );
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
