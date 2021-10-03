var width = document.getElementById('stageContainer').clientWidth; //these probably shouldn't be global (lazy)
var height = document.getElementById('stageContainer').clientHeight;
var layer = new Konva.Layer(); //not sure if I should be using multiple "layers"
var stage = new Konva.Stage({
  container: 'stageContainer',
  width: width,
  height: height, 
})
initTransformer();




function initTransformer(){
  var tr = new Konva.Transformer({
    boundBoxFunc: function(oldBoundBox,newBoundBox){ //stops transformer from working. selection and move only
        return oldBoundBox;
    }
    });
    layer.add(tr);
    tr.nodes();
    // add a new feature, lets add ability to draw selection rectangle
    var selectionRectangle = new Konva.Rect({
      fill: 'rgba(0,0,255,0.5)',
      visible: false,
    });
    layer.add(selectionRectangle);
    var x1, y1, x2, y2;
    stage.on('mousedown touchstart', (e) => {
      // do nothing if we mousedown on any shape
      if (e.target !== stage) {
        return;
      }
      x1 = stage.getPointerPosition().x;
      y1 = stage.getPointerPosition().y;
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;
      selectionRectangle.visible(true);
      selectionRectangle.width(0);
      selectionRectangle.height(0);
    });
    stage.on('mousemove touchmove', () => {
      // do nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;
      selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });
    });
    stage.on('mouseup touchend', () => {
      // do nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      // update visibility in timeout, so we can check it in click event
      setTimeout(() => {
        selectionRectangle.visible(false);
      });
      var cards = stage.find('.card');
      var markers = stage.find('.marker')
      var box = selectionRectangle.getClientRect();
      var cardsSelected=(cards.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      ));
      var markersSelected=(markers.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      ));
      var selected=cardsSelected.concat(markersSelected)
      tr.nodes(selected);
    });    
}
function drawCardOnCanvas(imageObj,xPosition,yPosition,playerSelect) { //pass it the image object, x and y
  if(player==playerSelect){ //DRAW CARD ON YOUR OWN SIDE CAPS OMG
     var cardImg = new Konva.Image({
      name: 'card', //this name is important to be the same for all
      image: imageObj,
      x: xPosition,
      y: yPosition,
      width: stage.height() /10,  //arbitrary size scaling
      height: stage.height()/10*1.375,
      draggable: true,
      id: imageObj.id
    });

    // add cursor styling
    cardImg.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    cardImg.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    cardImg.on('click',function(e){
      if (e.evt.button===0) this.moveToTop(); //only on left click it will move the image to the top on stage
    })

    layer.add(cardImg); //add card to the layer
    stage.add(layer); //add layer to the stage
  }
  if(player!=playerSelect){ //draw opponents card
    var cardImg = new Konva.Image({
     name: 'opponentcard', //this name is important to be the same for all
     image: imageObj,
     x: stage.attrs.width-xPosition,
     y: stage.attrs.height-yPosition,
     width: stage.height() /10,  //arbitrary size scaling
     height: stage.height()/10*1.375,
     draggable: false,
     rotation:180,
     id: imageObj.id
   });

   // add cursor styling
   cardImg.on('mouseover', function () {
     document.body.style.cursor = 'pointer';
   });
   cardImg.on('mouseout', function () {
     document.body.style.cursor = 'default';
   });

   layer.add(cardImg); //add card to the layer
   stage.add(layer); //add layer to the stage
 }
  // don't add updateGameState here just don't it's a loop
}
function drawMarkerOnCanvas(imageObj,xPosition,yPosition,playerSelect) { //pass it the image object, x and y
  if(player==playerSelect){ //DRAW CARD ON YOUR OWN SIDE CAPS OMG
     var markerImg = new Konva.Image({
      name: 'marker', //this name is important to be the same for all
      image: imageObj,
      x: xPosition,
      y: yPosition,
      width: stage.height() /14,  //arbitrary size scaling
      height: stage.height() /14,
      draggable: true,
      id: imageObj.id
    });

    // add cursor styling
    markerImg.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    markerImg.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    markerImg.on('click',function(e){
      if (e.evt.button===0) this.moveToTop(); //only on left click it will move the image to the top on stage
    })

    layer.add(markerImg); //add card to the layer
    stage.add(layer); //add layer to the stage
  }
  if(player!=playerSelect){ //draw opponents card
    var markerImg = new Konva.Image({
     name: 'opponentmarker', //this name is important to be the same for all
     image: imageObj,
     x: stage.attrs.width-xPosition,
     y: stage.attrs.height-yPosition,
     width: stage.height() /14,  //arbitrary size scaling
     height: stage.height() /14,
     draggable: false,
     rotation:180,
     id: imageObj.id
   });

   // add cursor styling
   markerImg.on('mouseover', function () {
     document.body.style.cursor = 'pointer';
   });
   markerImg.on('mouseout', function () {
     document.body.style.cursor = 'default';
   });

   layer.add(markerImg); //add card to the layer
   stage.add(layer); //add layer to the stage
 }
  // don't add updateGameState here just don't it's a loop
}
function addMarkerToStage(markerId,markerSrc){
  let imageObj= new Image();
  imageObj.src=markerSrc
  imageObj.id=(Math.random() + 1).toString(36).substring(2); //randomly generates and id for that marker
  drawMarkerOnCanvas(imageObj,stage.width()/3,stage.height()/3*2,player) //arbitrary placement
}
function removeCardToHand(id){
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    hand.addCardToHand(id,currentSelection[0].attrs.image.src)
    currentSelection[0].destroy()
  }
  updateGameState()
}
function removeCardToDiscard(id){
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    discard.addCardToDiscard(id,currentSelection[0].attrs.image.src)
    currentSelection[0].destroy()
  }
  updateGameState()
}
function removeCardToDeck(id){
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    discard.addCardToDiscard(id,currentSelection[0].attrs.image.src)
    currentSelection[0].destroy()
  }
  updateGameState()
}
function removeMarker(id){
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    currentSelection[0].destroy()
  }
  updateGameState()
}
function stageViewCardModal(id){
  // Get the modal
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    var modal = document.getElementById("cardModal");
    var src = currentSelection[0].attrs.image.src;
    modal.style.display = "block";
    var modalImg = document.getElementById("img01");
    modal.style.display = "block";
    modalImg.src = src;
  }
  

  // Get the image and insert it inside the modal - use its "alt" text as a caption
}