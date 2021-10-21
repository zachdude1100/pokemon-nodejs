function getUserDecksAndInv(){
    let formatselection=document.getElementById("formatselection")
    console.log(formatselection.value)
    $.ajax({
        type:'GET',
        url:'/deckcalculation/getUserDecksAndInv',
        data:{formatselection:formatselection.value},
        success:function(data){
            calculateTwoDecks(data.filteredInvArr,data.decksArr)
      },
    });
}
function calculateTwoDecks(inventory,decks){
    let mergedDecks=[]
    for (let i=0;i<decks.length;i++){
        for(let j=i+1;j<decks.length;j++){
            let allCards=decks[i].cards.concat(decks[j].cards)
            mergedDecks.push({id:decks[i].deckName+" vs "+decks[j].deckName,cards:mergeTwoDecksCards(allCards)})
        }
    }
    console.log(mergedDecks)
}
function mergeTwoDecksCards(allCards){
    for (let i=0; i<allCards.length;i++){
        for (let j=i+1;j<allCards.length;j++){
            if(allCards[i].prints.equals(allCards[j].prints)==true){
                allCards[i].instances=Number(allCards[i].instances)+Number(allCards[j].instances)
                allCards.splice(j,1)
            }
        }
    }
    return allCards
}

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});