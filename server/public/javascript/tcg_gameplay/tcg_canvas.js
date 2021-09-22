var width = document.getElementById('stageContainer').clientWidth; //these probably shouldn't be global (lazy)
var height = document.getElementById('stageContainer').clientHeight;
var randomStageSeed=Math.floor(Math.random()*2) //entirely temporary bullshit just to generate the client in 180 orientation randomly

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

var layer = new Konva.Layer(); //not sure if I should be using multiple "layers"

function updateGameState(gameState){
    gameState.forEach(card=>{ //game state is sent as an array of card objects
      var cardQuery=stage.find('#'+card.id)[0] //look for the card id on the stage
      if (cardQuery!=undefined){ //if its there, move it
        tween=new Konva.Tween({
          node:cardQuery,
          duration:0.1,
          x:card.x,
          y:card.y
        }).play()
      }
      else{  //if it's not there, draw it for the first time
        let imageObj= new Image();
        imageObj.src=card.src
        imageObj.id=card.id
        drawCardOnCanvas(imageObj,card.x,card.y) //sends the Image(?) object and the position to draw the card
      }
    })
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

