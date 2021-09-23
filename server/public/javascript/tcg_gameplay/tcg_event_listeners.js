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
      selection.id=selection.id.split('_')[0]+"_"+id //this is beautiful. the _ is very important as it's the break character so subsequent right clicks will break it off and append new
    })
}

function hideContextMenu(){
  const allContextMenus = Array.from(document.getElementsByClassName("context-menu")); //array of all context menus
  allContextMenus.forEach(menu=>{ //iterate
    menu.classList.remove("visible") //remove visibility
  })
  
}

document.addEventListener("click",function(event){ //global click listener to update game state
    var allCardsOnStage=stage.find('.card') //finds all on field with the name of card, so all of them
    var stageData=[];
    allCardsOnStage.forEach(card=>{
      stageData.push({id:card.attrs.id,src:card.attrs.image.src,x:card.attrs.x,y:card.attrs.y}) //all needed info to draw and update a card on the other player's screen
    })
    socket.emit('gameState',stageData) //emits the game state
    hideContextMenu(); //global hide context menu whenever anything is clicked. Can't think of why you wouldn't want to
    hand.hideCardModal();
  })

$(document).on('click',".contextSelection" ,function(event){ //onclick for your hand
    var str = this.id   //takes the appended id to string var
    var id = str.split('_')[1]; //splits the string into id and "action"
    var action = str.split('_')[0];
    if (action=="placeCardInPlay"){
      const src=document.getElementById(id).src //grabs the image source for the selected image
      hand.placeCardInPlay(id,src)
    }
    if (action=="drawCard"){
      deck.drawCard();
    }
    if (action=="viewCard"){
      const src=document.getElementById(id).src
      hand.viewCardModal(id,src)
    }
    hideContextMenu();
});

$(document).on('click',"#deck_img" ,function(event){ //onclick for your hand
  deck.drawCard()
});
function asdf(id){
  console.log(id)
}