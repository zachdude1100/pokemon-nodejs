function getInventory(){
    let formatSelection=document.getElementById('formatselection').value;
    $.ajaxSetup({ cache: false });
    $.ajax({  // grabs the inventory data from all the cards sent via json
        type: 'GET',
        url: '/formatcalculation/extracardstest',
        data: formatSelection,
        success: function(invResult) { 
            getDecks(invResult);
        },
        contentType: 'application/json',
        dataType: 'JSON'
    })
}
function getDecks(invResult){
    let formatSelection=document.getElementById('formatselection').value;
    $.ajaxSetup({ cache: false });
    $.ajax({  // grabs the deck data
        type: 'GET',
        url: '/play/decksinformat',
        data: formatSelection,
        success: function(deckResult) { 
            let deckResultObj=JSON.parse(JSON.stringify(deckResult));
            const deckResultArray=Object.values(deckResultObj);
            formatDeckInv(deckResultArray,invResult);
        },
        contentType: 'application/json',
        dataType: 'JSON'
    })   
}
function formatDeckInv(deckResultArray,invResult){ //goal is to format each deck into itself, sorted with lowest alphabetical duplicate (previosuly calculated) and add up the inventory and deck instances
    decksFormatted=[];
    
    deckResultArray.forEach(deck=>{
        deckFormatted=[];
        let deckCards=Object.values(deck.cards)
        deckCards.forEach(deckCard=>{ //find and grab card data from inventory, based on what is in each deck
            invResult.forEach(invCardObj=>{
                invCardObj.id.forEach(invCardID=>{
                    if (invCardID == deckCard.id){
                        deckFormatted.push({id:invCardObj.id[0],inventory:invCardObj.inventory,name:invCardObj.name,set:invCardObj.set,instances:deckCard.instances,imageUrl:invCardObj.imageUrl,imageUrlHiRes:invCardObj.imageUrlHiRes})
                    }
                })
            })
        })
        let removeIndices=[]; //If 2 duplicates are in the deck they need combined into one entry to stop the rest from fucking up
        for (let i=0;i<deckFormatted.length;i++){
            for(let j=i+1;j<deckFormatted.length;++j){
                if (deckFormatted[i].id===deckFormatted[j].id){
                    let instances = Number(deckFormatted[i].instances)+Number(deckFormatted[j].instances);
                    deckFormatted[i].instances=instances
                    deckFormatted.splice(j--,1)                
                }
            }
        }
        decksFormatted.push({deckName:deck.deckName,format:deck.format,cards:deckFormatted,_id:deck._id})

        
    })
    calculateTwoDecks(decksFormatted); //calculate 2 decks vs each other from the array of decks at this step
}
function calculateTwoDecks(decksFormatted){
    let deckCalcArray = []; //final array of deck calculations
    for(let i=0;i<decksFormatted.length;i++){ //iterate each deck vs the next, i and j
        for(let j=i+1;j<decksFormatted.length;j++){
            let combinationArray=decksFormatted[i].cards.concat(decksFormatted[j].cards) //smashes the 2 decks together
            let calculatedArray = [];
            for(let k=0;k<combinationArray.length;k++){ //iterate each card in each deck against each other to calculated amount needed k and l
                let uniqueCard=true; //if card only appears once in the vs matchup it can just be added straight
                let instancesGtInv=false; //bool to keep track of if the needed amount of cards exceeds inventory
                calculatedArray[k]={};
                for(let l=k+1;l<combinationArray.length;l++){
                    if (combinationArray[k].id==combinationArray[l].id){
                        calculatedArray[k].instances = Number(combinationArray[k].instances)+Number(combinationArray[l].instances) //add the instances needed together if the id match
                        uniqueCard=false; //say that each deck needs this card for deck matchup
                        combinationArray.splice(l--,1) //removes and decrements element l from array, which would be the 2nd instance of that card in the deck
                    }
                }
                if (uniqueCard == false){
                    calculatedArray[k].id=combinationArray[k].id
                    calculatedArray[k].name=combinationArray[k].name
                    calculatedArray[k].set=combinationArray[k].set
                    calculatedArray[k].inventory=combinationArray[k].inventory
                    calculatedArray[k].imageUrl=combinationArray[k].imageUrl
                    calculatedArray[k].imageUrlHiRes=combinationArray[k].imageUrlHiRes
                }
                else{ //same as above but includes the regular amount of instances for a unique card
                    calculatedArray[k].id=combinationArray[k].id
                    calculatedArray[k].name=combinationArray[k].name
                    calculatedArray[k].set=combinationArray[k].set
                    calculatedArray[k].inventory=combinationArray[k].inventory
                    calculatedArray[k].instances=combinationArray[k].instances
                    calculatedArray[k].imageUrl=combinationArray[k].imageUrl
                    calculatedArray[k].imageUrlHiRes=combinationArray[k].imageUrlHiRes
                }
                if (calculatedArray[k].instances>calculatedArray[k].inventory){ //compares if the instances needed are higher than inventory
                    instancesGtInv=true;
                }
                calculatedArray[k].instancesGtInv=instancesGtInv; //sets a bool on each card saying whether u need to buy more
            }
            deckCalcArray.push({deckNames:decksFormatted[i].deckName+' vs '+decksFormatted[j].deckName,cards:calculatedArray,deck1_id:decksFormatted[i]._id,deck2_id:decksFormatted[j]._id,deck1name:decksFormatted[i].deckName,deck2name:decksFormatted[j].deckName})          
        }
    }
    console.log(deckCalcArray)
    drawResult(deckCalcArray)
}

function drawResult(deckCalcArray){
    document.querySelectorAll('carddiv').forEach(e => e.remove());
    for (let i=0;i<deckCalcArray.length;i++){ // go through each deck matchup
        for (let j=0;j<deckCalcArray[i].cards.length;j++){  //go through each card in that matchup
            if(deckCalcArray[i].cards[j].instancesGtInv==true){
                if(document.getElementById(deckCalcArray[i].cards[j].id)==null){
                    let cardIdDiv = document.createElement('div');
                    cardIdDiv.innerText=deckCalcArray[i].cards[j].name+"   ///   "+deckCalcArray[i].cards[j].id
                    cardIdDiv.setAttribute("id",deckCalcArray[i].cards[j].id)
                    cardIdDiv.setAttribute("class","carddiv");
                    document.getElementById("cards").appendChild(cardIdDiv);
                    let collapsibleButton = document.createElement('button');
                    collapsibleButton.innerText="Click to see deck breakdown"
                    collapsibleButton.setAttribute("id",deckCalcArray[i].cards[j].id+"button")
                    collapsibleButton.setAttribute("class","collapsible")
                    document.getElementById(deckCalcArray[i].cards[j].id).appendChild(collapsibleButton)
                    let contentDiv = document.createElement('div');
                    contentDiv.setAttribute("id",deckCalcArray[i].cards[j].id+"contentdiv")
                    contentDiv.setAttribute("class","content")
                    document.getElementById(deckCalcArray[i].cards[j].id).appendChild(contentDiv)
                    
                }
                $('#'+deckCalcArray[i].cards[j].id+"contentdiv").append('<p>You are missing '+(deckCalcArray[i].cards[j].instances-deckCalcArray[i].cards[j].inventory)+' '+deckCalcArray[i].cards[j].name+' for decks <a href="http://webserver.zachicus.xyz:3000/deckviewer/deck/'+deckCalcArray[i].deck1_id+'">'+deckCalcArray[i].deck1name+'</a> vs <a href="http://webserver.zachicus.xyz:3000/deckviewer/deck/'+deckCalcArray[i].deck2_id+'">'+deckCalcArray[i].deck2name+'</a></p>')
            }
        }
    }
    collapsibleBoxStart()
}

function collapsibleBoxStart(){
    var coll = document.getElementsByClassName("collapsible");
    var i;
    console.log(coll)

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
