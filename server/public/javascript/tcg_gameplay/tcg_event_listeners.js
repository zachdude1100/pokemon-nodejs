function showContextMenu(id){   //show context menu with passed thru card id
  const contextMenu = document.getElementById("context-menu");  //right click listener to pop up the drop down menu
    const { clientX: mouseX, clientY: mouseY } = event;

    contextMenu.style.top = `${mouseY}px`;
    contextMenu.style.left = `${mouseX}px`;

    contextMenu.classList.add("visible");
    const placeCardInPlay = document.getElementById("placeCardInPlay")
    placeCardInPlay.setAttribute("id","placeCardInPlay"+id)
}

function hideContextMenu(){
  const contextMenu = document.getElementById("context-menu")
  contextMenu.classList.remove("visible")
}

document.addEventListener("click",function(event){ //global click listener to update game state
    var allCardsOnStage=stage.find('.card') //finds all on field with the name of card, so all of them
    var stageData=[];
    allCardsOnStage.forEach(card=>{
      stageData.push({id:card.attrs.id,src:card.attrs.image.src,x:card.attrs.x,y:card.attrs.y}) //all needed info to draw and update a card on the other player's screen
    })
    socket.emit('gameState',stageData) //emits the game state
  })

$(document).on('click',".card" ,function(){  //onclick for your hand
    placeCardInPlay(this.id,this.src)  //grab the id and send it to be placed
    removeCardFromHand(this.id);  //remove the card from hand global variable
});

$(document).on('click',".placeCardInPlay" ,function(event){ //onclick for your hand
    var str = this.id   //takes the appended id to string var
    var id = str.replace("placeCardInPlay","") //replaces the placeholder with nothing, so back to just id
    this.id="placeCardInPlay" //set the id back to placeCardInPlay
    var card = document.getElementById(id) //selects the card image of that id
    placeCardInPlay(card.id,card.src)  //grab the id and send it to be placed
    removeCardFromHand(card.id);  //remove the card from hand global variable

    hideContextMenu();
});