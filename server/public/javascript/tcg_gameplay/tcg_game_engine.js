var socket;
socket=io.connect('10.70.0.3:3000')
socket.on('gameState',updateGameState) //upon receiving game state packet from the other player:

var deck;
function initializeDeck(rawDeck,gameUUID){
  deck = new Deck();
  deck.initDeck(rawDeck)
  deck.shuffleDeck();
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
            cardImage.oncontextmenu = function () {
              showContextMenu(cardImage.id);
              //The return kills the normal context menu
              return false;
            }
  
            document.getElementById("hand").appendChild(cardImage);
    }
    
  }
  
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