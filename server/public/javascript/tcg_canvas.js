//const { default: Konva } = require("konva");

var socket;
socket=io.connect('10.10.0.6:3000')
socket.on('gameState',updateGameState)

var width = document.getElementById('stageContainer').clientWidth;
var height = document.getElementById('stageContainer').clientHeight;
    var stage = new Konva.Stage({
        container: 'stageContainer',
        width: width,
        height: height
  });
var layer = new Konva.Layer();



function updateGameState(gameState){
    gameState.forEach(card=>{
      var cardQuery=stage.find('#'+card.id)[0]
      if (cardQuery!=undefined){
        tween=new Konva.Tween({
          node:cardQuery,
          duration:0.1,
          x:card.x,
          y:card.y
        }).play()
      }
      else{
        let imageObj= new Image();
        imageObj.src=card.src
        imageObj.id=card.id
        drawCardOnBoard(imageObj,card.x,card.y)
      }
    })
}

document.addEventListener("click",function(event){
  var allCardsOnStage=stage.find('.card')
  var stageData=[];
  allCardsOnStage.forEach(card=>{
    stageData.push({id:card.attrs.id,src:card.attrs.image.src,x:card.attrs.x,y:card.attrs.y})
  })
  socket.emit('gameState',stageData)
})

var deck=[];
var cardsInHand=[];
function initializeDeck(rawDeck){
  rawDeck.forEach(card => {
    var instances=card.instances;
    for (let i=0;i<instances;i++){
      var rand = Math.random().toString(36).substr(2, 16)
      deck.push({id: card.id,imageUrl:card.imageUrl, _id:rand})
    }
  });
  shuffle(deck);
}
function shuffle(shuffleDeck) {
  var newDeck = [];
  for (var i = 0; i < shuffleDeck.length; i++) {    
      var rand = Math.floor(Math.random() * (i + 1));  
      newDeck[i] = newDeck[rand];
      newDeck[rand] = shuffleDeck[i];
  }
  deck=newDeck;
  drawCardFromDeck() //temporary fix for not having a deck to click
}  

function drawCardFromDeck(){
  for (let i=0; i<7;i++){
    cardsInHand[i]=deck[i]
  }
  animateHand()
}

function animateHand(){
  cardCounter=0;
  document.querySelectorAll('.card').forEach(e => e.remove());
  for (let i = 0; i < cardsInHand.length; i++){
          let cardImage = document.createElement('img');
          cardImage.src = cardsInHand[i].imageUrl;
          cardImage.setAttribute("class","card")
          cardImage.setAttribute("id",cardsInHand[i]._id);
          document.getElementById("hand").appendChild(cardImage);
  }
  
}

$(document).on('click',".card" ,function(){
  placeCardInPlay(this.id)
  removeCardFromHand(this.id);  
});

function removeCardFromHand(id){
  for (let i = 0; i<cardsInHand.length;i++){
      if (cardsInHand[i]._id === id){
          cardsInHand.splice(i,1);
          animateHand();
          break;
      }
      else{}
  }
}

function drawCardOnBoard(imageObj,xPosition,yPosition) {
  var cardImg = new Konva.Image({
    name: 'card',
    image: imageObj,
    x: xPosition,
    y: yPosition,
    width: stage.height() /10,
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

  layer.add(cardImg);
  stage.add(layer);
}

function placeCardInPlay(cardId){
  for (let i =0;i<cardsInHand.length;i++){
    if (cardsInHand[i]._id==cardId){
      let imageObj= new Image();
      imageObj.src=cardsInHand[i].imageUrl
      imageObj.id=cardsInHand[i]._id
      drawCardOnBoard(imageObj,stage.width() / 2 - 200 / 2,stage.height() / 2 - 137 / 2)
    }
  }

}