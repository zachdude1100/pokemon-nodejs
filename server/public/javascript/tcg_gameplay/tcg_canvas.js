//const { default: Konva } = require("konva");

var socket;
socket=io.connect('10.10.0.6:3000')
socket.on('gameState',updateGameState) //upon receiving game state packet from the other player:

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
    //rotation: 180,
    //x: width,
    //y:height
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

document.addEventListener("click",function(event){ //global click listener to update game state
  var allCardsOnStage=stage.find('.card') //finds all on field with the name of card, so all of them
  var stageData=[];
  allCardsOnStage.forEach(card=>{
    stageData.push({id:card.attrs.id,src:card.attrs.image.src,x:card.attrs.x,y:card.attrs.y}) //all needed info to draw and update a card on the other player's screen
  })
  socket.emit('gameState',stageData) //emits the game state
})

var deck;
function initializeDeck(rawDeck,gameUUID){
  deck = new Deck(rawDeck,gameUUID);
  deck.shuffle();
}
var cardsInHand=[];

function drawCardFromDeck(){ //will eventually not draw 7, will be one at a time
  for (let i=0; i<7;i++){
    cardsInHand[i]=deck.deck[i]
    console.log(cardsInHand[i])
  }
  animateHand() //call function to "animate" the hand because draw has conflicting wording
}

function animateHand(){ //draw the hand on the screen in the id=hand div
  document.querySelectorAll('.card').forEach(e => e.remove()); //removes all before redrawing (laziness)
  for (let i = 0; i < cardsInHand.length; i++){
          let cardImage = document.createElement('img');
          cardImage.src = cardsInHand[i].imageUrl;
          cardImage.setAttribute("class","card")
          cardImage.setAttribute("id",cardsInHand[i]._id);
          document.getElementById("hand").appendChild(cardImage);
  }
  
}

$(document).on('click',".card" ,function(){  //onclick for your hand
  placeCardInPlay(this.id,this.src)  //grab the id and send it to be placed
  removeCardFromHand(this.id);  //remove the card from hand global variable
});

function removeCardFromHand(id){
  for (let i = 0; i<cardsInHand.length;i++){ //iterates thru hand
      if (cardsInHand[i]._id === id){
          cardsInHand.splice(i,1); //remove it
          animateHand(); //animate the hand again
          break;
      }
      else{}
  }
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

