function setOptions(dropDownNumber)
{        
    document.getElementById('deckselection'+dropDownNumber).options.length = 0; // remove all options
    let formatSelection=document.getElementById('formatselection'+dropDownNumber).value;
        let deckName = document.createElement('option');
        deckName.setAttribute("name","placeholder");
        deckName.innerText="select a deck";
        document.getElementById("deckselection"+dropDownNumber).appendChild(deckName);

        $.ajax({  // grabs the card data from get request in the database
            type: 'GET',
            url: '/versuscalculation/decksinformat',
            data: formatSelection,
            success: function(deckResult) { 
                let deckResultArr=Object.values(deckResult);
                deckResultArr.forEach(deck=>{
                let deckName = document.createElement('option');
                deckName.setAttribute("name",deck.deckName);
                deckName.innerText=deck.deckName;
                document.getElementById("deckselection"+dropDownNumber).appendChild(deckName);
                });
            },
            contentType: 'application/json',
            dataType: 'JSON'
        });     
}

function getDecks(){
    let deckSelection1=document.getElementById('deckselection1').value;
    let deckSelection2=document.getElementById('deckselection2').value;

    $.ajax({  // grabs the card data from get request in the database
        type: 'GET',
        url: '/versuscalculation/getdecks',
        data: {deckSelection1,deckSelection2},
        success: function(deckResult) { 
            let deckResultArr=Object.values(deckResult);
            calcCards(deckResultArr);
        },
        contentType: 'application/json',
        dataType: 'JSON'
    }); 
}

  function calcCards(deckResultArr){
      
      let deck1=[];
      let deck2=[];
      let combinedDecks=[];
      let condensedDecks=[];
    deck1=Object.values(deckResultArr[0].cards);
    if (deckResultArr[1] != undefined){
    deck2=Object.values(deckResultArr[1].cards);
    }
    else{
        deck2=deck1;
    }
        combinedDecks=deck1.concat(deck2);
        for(let i=0; i<combinedDecks.length; i++){
            for(let j=i+1;j<combinedDecks.length;j++){
                if(combinedDecks[i].id===combinedDecks[j].id){
                    combinedDecks[i].instances=String(Number(combinedDecks[i].instances)+Number(combinedDecks[j].instances));
                    combinedDecks.splice(j--,1);
                }
                else{}
            }
        }
        for(let i=0; i<combinedDecks.length; i++){
            if (combinedDecks[i].instances!=="0"){
                condensedDecks.push(combinedDecks[i]);
            }
        }
        let condensedObject=Object.assign({}, condensedDecks);
        $.ajax({  // grabs the card data from get request in the database
            type: 'GET',
            url: '/versuscalculation/submit',
            data: condensedObject,
            success: function(cardResult) { 
                //alert('data: ' + data);
                let cardResultArr=Object.values(cardResult);
                calcResult(condensedDecks,cardResultArr);
            },
            contentType: 'application/json',
            dataType: 'JSON'
        }); 

  }

function calcResult(cardReq,cardRes){ //crazy ass long ass for loop to compare the requested cards from the deck selection (missing too much shit) to the cards returned from the db
    combinedResult=[];
    cardReq.forEach(req => {
        cardRes.forEach(res=>{
            if(req.id==res.id){
                inventory=0;
                res.duplicateprints.forEach(print => {
                    const index = cardRes.map(e => e.id).indexOf(print);
                     inventory+=cardRes[index].inventory;
                });
                inventory+=res.inventory;
            let missingCards=req.instances-inventory;
                if (missingCards<0){
                    missingCards=0;
                }
                else{}
            combinedResult.push({name:res.name,id:res.id,imageUrl:res.imageUrl,inventory:inventory,duplicateprints:res.duplicateprints,deckInstances:Number(req.instances),missingCards:missingCards})
            }
            else{}
        })
    });
    drawResult(combinedResult);

}
function drawResult(combinedResult){
    document.querySelectorAll('.carddiv').forEach(e => e.remove());
    for(let i =0; i<combinedResult.length;i++){
        if(combinedResult[i].missingCards >0 ){
            let cardDiv = document.createElement('div');
            cardDiv.setAttribute("class","carddiv");
            cardDiv.setAttribute("id","carddiv"+''+i+'')
            document.getElementById("cards").appendChild(cardDiv);
            
            let cardImage = document.createElement('img');
            cardImage.src = combinedResult[i].imageUrl;
            cardImage.setAttribute("class","card")
            cardImage.setAttribute("id",''+combinedResult[i].id+'');
            document.getElementById("carddiv"+''+i+'').appendChild(cardImage);
              
            let cardName = document.createElement('p');
            cardName.innerText=combinedResult[i].name;
            cardName.setAttribute("class","cardname");
            document.getElementById("carddiv"+''+i+'').appendChild(cardName);

            combinedResult[i].duplicateprints.forEach(element => {
                let duplicateIds = document.createElement('p');
                duplicateIds.innerText="Set: "+element.set+"   #"+element.number;
                duplicateIds.setAttribute("class","duplicateId");
                document.getElementById("carddiv"+''+i+'').appendChild(duplicateIds);
                });
            let cardInventoryCurrent = document.createElement('p');
            cardInventoryCurrent.innerText="Current Inventory: "+combinedResult[i].inventory;
            cardInventoryCurrent.setAttribute("class","inventorycurrent");
            document.getElementById("carddiv"+''+i+'').appendChild(cardInventoryCurrent); 

            let deckInstances = document.createElement('p');
            deckInstances.innerText="Number required to build these decks: "+combinedResult[i].deckInstances;
            deckInstances.setAttribute("class","deckinstances");
            document.getElementById("carddiv"+''+i+'').appendChild(deckInstances);
            
            let missingCards = document.createElement('p');
            missingCards.innerText="You're missing: "+combinedResult[i].missingCards+" Cards";
            missingCards.setAttribute("class","inventorycurrent");
            document.getElementById("carddiv"+''+i+'').appendChild(missingCards);
            
            
            
            
        }
    }
}