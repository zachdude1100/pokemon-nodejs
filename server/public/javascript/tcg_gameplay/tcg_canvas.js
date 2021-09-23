var width = document.getElementById('stageContainer').clientWidth; //these probably shouldn't be global (lazy)
var height = document.getElementById('stageContainer').clientHeight;
var randomStageSeed=Math.floor(Math.random()*2) //entirely temporary bullshit just to generate the client in 180 orientation randomly
var layer = new Konva.Layer(); //not sure if I should be using multiple "layers"
if (randomStageSeed==0){
  var stage = new Konva.Stage({
    container: 'stageContainer',
    width: width,
    height: height,
    rotation: 180,
    x: width,
    y:height
  });
}
if (randomStageSeed==1){
  var stage = new Konva.Stage({
    container: 'stageContainer',
    width: width,
    height: height,
  });
}

function drawCardOnCanvas(imageObj,xPosition,yPosition) { //pass it the image object, x and y
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

  layer.add(cardImg); //add card to the layer
  stage.add(layer); //add layer to the stage
}

function placeCardInPlay(cardId,cardSrc){  //loop needed because of the data being stripped from the image  
  let imageObj= new Image();
  imageObj.src=cardSrc
  imageObj.id=cardId
  drawCardOnCanvas(imageObj,stage.width() / 2 - 200 / 2,stage.height() / 2 - 137 / 2) //arbitrary placement
}

function removeCardToHand(id){
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    hand.addCardToHand(id,currentSelection[0].attrs.image.src)
    currentSelection[0].destroy()
  }
}
function removeCardToDiscard(id){
  var currentSelection = stage.find("#"+id)
  if (currentSelection != undefined){
    discard.addCardToDiscard(id,currentSelection[0].attrs.image.src)
    currentSelection[0].destroy()
  }
}