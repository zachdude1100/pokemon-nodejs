var socket;
socket=io.connect('10.70.0.3:3000')
socket.on('gameState',updateGameState) //upon receiving game state packet from the other player:

var deck= new Deck()
var hand = new Hand()



  function removeCardFromHand(id){
    for (let i = 0; i<hand.cards.length;i++){ //iterates thru hand
        if (hand.cards[i]._id === id){
            hand.cards.splice(i,1); //remove it
            //animateHand(); //animate the hand again
            break;
        }
        else{}
    }
  }
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