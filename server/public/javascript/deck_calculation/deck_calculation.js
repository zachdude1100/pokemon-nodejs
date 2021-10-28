function getUserDecksAndInv(){
    let formatselection=document.getElementById("formatselection")
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
    compareDecksToInv(inventory,mergedDecks)
}
function compareDecksToInv(inventory,mergedDecks){
    comparedArr=[]
    for (let deckVs of mergedDecks){
        for (let deckCard of deckVs.cards){
            let printInvCount=0;
            for (let deckPrint of deckCard.prints){
                for (let invCard of inventory){
                    if (deckPrint===invCard.id){
                        printInvCount+=Number(invCard.playSetInv)
                        break
                    }
                }  
            }
            comparedArr.push({deckVs:deckVs.id,id:deckCard.id,prints:deckCard.prints,name:deckCard.name,instances:Number(deckCard.instances),inventory:printInvCount})
            
        }
    }
    drawResult(comparedArr)
}
function mergeTwoDecksCards(allCards){
    let mergedCards=[]
    for (let i=0; i<allCards.length;i++){
        let instances=Number(allCards[i].instances)
        for (let j=i+1;j<allCards.length;j++){
            if(allCards[i].prints.equals(allCards[j].prints)==true){
                instances+=Number(allCards[j].instances)
                allCards.splice(j,1)
            }
        }
        mergedCards.push({id:allCards[i].id,name:allCards[i].name,prints:allCards[i].prints,instances:instances})
    }
    return mergedCards
    
}
function drawResult(deckCalcArray){
    document.querySelectorAll('.carddiv').forEach(e => e.remove());
    for (let deckVs of deckCalcArray){
        if(deckVs.instances>deckVs.inventory){
            if(document.getElementById(deckVs.id)==null){
                let cardIdDiv = document.createElement('div');
                cardIdDiv.innerText=deckVs.name+"   ///   "+deckVs.prints
                cardIdDiv.setAttribute("id",deckVs.id)
                cardIdDiv.setAttribute("class","carddiv");
                document.getElementById("cards").appendChild(cardIdDiv);
                let collapsibleButton = document.createElement('button');
                collapsibleButton.innerText="Click to see deck breakdown"
                collapsibleButton.setAttribute("id",deckVs.id+"button")
                collapsibleButton.setAttribute("class","collapsible")
                document.getElementById(deckVs.id).appendChild(collapsibleButton)
                let contentDiv = document.createElement('div');
                contentDiv.setAttribute("id",deckVs.id+"contentdiv")
                contentDiv.setAttribute("class","content")
                document.getElementById(deckVs.id).appendChild(contentDiv)
            }
        $('#'+deckVs.id+"contentdiv").append('<p>You are missing '+(deckVs.instances-deckVs.inventory)+' '+deckVs.name+' for decks '+deckVs.deckVs)
        }
    }
    collapsibleBoxStart()
}

function collapsibleBoxStart(){
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }   
    });
    }
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