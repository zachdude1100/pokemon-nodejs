function showContextMenu(id,selector){   //show context menu with passed thru hand/deck/discard/etc selector
  hideContextMenu(); //ensures only one context menu is up at a time no matter what
  scope=document.querySelector("body");
  const contextMenu = document.getElementById("context-menu_"+selector);  //right click listener to pop up the drop down menu
  
  const { clientX: mouseX, clientY: mouseY } = event;
  const normalizePozition = (mouseX, mouseY) => {
    // ? compute what is the mouse position relative to the container element (scope)
    const {
      left: scopeOffsetX,
      top: scopeOffsetY,
    } = scope.getBoundingClientRect();
    
    const scopeX = mouseX - scopeOffsetX;
    const scopeY = mouseY - scopeOffsetY;
  
    // ? check if the element will go out of bounds
    const outOfBoundsOnX =
      scopeX + 150 > scope.clientWidth; //HARD CODED BULLSHIT FIX LATER, COULDN"T GET IT TO ACTUALLY WORK WITH .clientWidth
    
    const outOfBoundsOnY =
      scopeY + 150 > scope.clientHeight;
  
    let normalizedX = mouseX;
    let normalizedY = mouseY;
  
    // ? normalzie on X
    if (outOfBoundsOnX) {
      normalizedX =
        scopeOffsetX + scope.clientWidth - 150;
    }
  
    // ? normalize on Y
    if (outOfBoundsOnY) {
      normalizedY =
        scopeOffsetY + scope.clientHeight - 150;
    }
  
    return { normalizedX, normalizedY };
  }; 
  
  const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);

  contextMenu.style.top = `${normalizedY}px`;
  contextMenu.style.left = `${normalizedX}px`;


    contextMenu.classList.add("visible");
    const allContextSelections = Array.from(document.getElementsByClassName("contextSelection")) //this seems dangerous but it works
    allContextSelections.forEach(selection=>{
      selection.id=selection.id.split('-')[0]+"-"+id //this is beautiful. the _ is very important as it's the break character so subsequent right clicks will break it off and append new
    })
}

function hideContextMenu(){
  const allContextMenus = Array.from(document.getElementsByClassName("context-menu")); //array of all context menus
  allContextMenus.forEach(menu=>{ //iterate
    menu.classList.remove("visible") //remove visibility
  })
  
}

document.addEventListener("click",function(event){ //global click listener to update game state
    updateGameState();
    socket.emit('updateGameState')
    hideContextMenu(); //global hide context menu whenever anything is clicked. Can't think of why you wouldn't want to
    hand.hideCardModal();
    deck.hideDeckModal();
    discard.hideDiscardModal();
  })

$(document).on('click',".contextSelection" ,function(event){ //onclick for your hand
    var str = this.id   //takes the appended id to string var
    var id = str.split('-')[1]; //splits the string into id and "action"
    var action = str.split('-')[0];
    if (action=="viewCards_deck"){
      deck.viewDeckModal()
    }
    if (action=="drawCard_deck"){
      deck.drawCard();
    }
    if (action=="viewCards_discard"){
      discard.viewDiscardModal()
    }
    if (action=="viewCard_hand"){
      const src=document.getElementById(id).src
      hand.viewCardModal(id,src)
    }
    if (action=="viewCard_playerStage" || action=="viewCard_opponentStage"){
      stageViewCardModal(id)
    }
    if (action=="placeCardInHand_playerStage"){
      removeCardToHand(id)
    }
    if(action=="placeCardInDiscard_playerStage"){
      removeCardToDiscard(id)
    }
    if(action=="placeCardInDeck_playerStage"){
      removeCardToDeck(id)
    }
    if (action=="drawPrize_prizes"){
      prizes.drawPrize();
    }
    if (action=="placeCardInDeck_hand"){
      const src=document.getElementById(id).src
      hand.placeCardInDeck(id,src)
    }
    if (action=="placeCardInDiscard_hand"){
      const src=document.getElementById(id).src
      hand.placeCardInDiscard(id,src)
    }
    if (action=="placeCardInPlay_hand"){
      const src=document.getElementById(id).src //grabs the image source for the selected image
      hand.placeCardInPlay(id,src)
    }
    if (action=="removeMarker_playerMarkers"){
      removeMarker(id);
    }
    hideContextMenu();
});


stage.on("contextmenu",function(e){
  e.evt.preventDefault();
  if (e.target === stage) {
    // if we are on empty place of the stage we will do nothing
    return;
  }
  var target=e.target;
  if(target.attrs.name=="card") showContextMenu(target.attrs.id,"playerStage");
  if(target.attrs.name=="opponentcard") showContextMenu(target.attrs.id,"opponentStage");
  if(target.attrs.name=="marker") showContextMenu(target.attrs.id,"playerMarkers");
})