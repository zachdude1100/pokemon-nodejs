var socket;
socket=io.connect('10.70.0.3:3000')
socket.on('updateGameState',updateGameState) //upon receiving game state packet from the other player:

var deck= new Deck()
var hand = new Hand()
var discard = new Discard()
var prizes = new Prizes()

var gamestate = {}; //full gamestate as found in the db

function updateGameState(){
  var allCardsOnStage=stage.find('.card') //finds all on field with the name of card, so all of them
  var stageData=[];
  allCardsOnStage.forEach(card=>{
    let xPercent=card.attrs.x/stage.attrs.width;
    let yPercent=card.attrs.y/stage.attrs.height;
    stageData.push({id:card.attrs.id,src:card.attrs.image.src,x:xPercent,y:yPercent}) //all needed info to draw and update a card on the other player's screen
  })
  var playerGameState = {
    gameUUID:gameUUID,
    player:player,
    deck:deck,
    discard:discard,
    hand:hand,
    prizes:prizes,
    stageData:stageData
  }
  $.ajax({   //update gamestate with whatever changed
    type: 'POST',
    url: '/tcg/updategamestate',
    data: playerGameState,
    success: function() {
      $.ajax({  //get full gamestate from db
        type: 'GET',
        url: '/tcg/getgamestate',
        data: {gameUUID:gameUUID},
        success: function(foundGame) { //update local gamestate variable to match db
            gamestate=foundGame;
            updateOpponentStage()
            updateGameStateHTML()
        },
      })
    }, 
  });
}

function updateOpponentStage(){
  
  if(player=="player1"&&gamestate.playerTwoStage!=undefined){ 
    stage.find(".opponentcard").forEach(card=>{card.destroy()})//destroy all card images for opponent on the screen and recreate them
    gamestate.playerTwoStage.forEach(card=>{
      let x=card.x*stage.attrs.width;
      let y=card.y*stage.attrs.height;
      let imageObj= new Image();
      imageObj.src=card.src
      imageObj.id=card.src
      drawCardOnCanvas(imageObj,x,y,"player2")
    })
  }
  if(player=="player2"&&gamestate.playerOneStage!=undefined){ 
    stage.find(".opponentcard").forEach(card=>{card.destroy()})//destroy all card images for opponent on the screen and recreate them
    gamestate.playerOneStage.forEach(card=>{
      let x=card.x*stage.attrs.width;
      let y=card.y*stage.attrs.height;
      let imageObj= new Image();
      imageObj.src=card.src
      imageObj.id=card.src
      drawCardOnCanvas(imageObj,x,y,"player1")
    })
  }
}
function updateGameStateHTML(){ //updates the screen with stats on your opponents shiz
  if (player=="player1"&&gamestate.playerTwoDeck!=undefined) document.getElementById("opponentdeckcount").innerText = "Opponent deck count - "+gamestate.playerTwoDeck.quantity;
  if (player=="player2"&&gamestate.playerOneDeck!=undefined) document.getElementById("opponentdeckcount").innerText = "Opponent deck count - "+gamestate.playerOneDeck.quantity;
  if (player=="player1"&&gamestate.playerTwoPrizes!=undefined) document.getElementById("opponentprizescount").innerText = "Opponent prizes count - "+gamestate.playerTwoPrizes.quantity;
  if (player=="player2"&&gamestate.playerOnePrizes!=undefined) document.getElementById("opponentprizescount").innerText = "Opponent prizes count - "+gamestate.playerOnePrizes.quantity;
  if (player=="player1"&&gamestate.playerTwoHand!=undefined) document.getElementById("opponenthandcount").innerText = "Opponent hand count - "+gamestate.playerTwoHand.quantity;
  if (player=="player2"&&gamestate.playerOneHand!=undefined) document.getElementById("opponenthandcount").innerText = "Opponent hand count - "+gamestate.playerOneHand.quantity;
}