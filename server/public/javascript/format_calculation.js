function getDecks(){
    let formatSelection=document.getElementById('formatselection').value;
    $.ajaxSetup({ cache: false });
    $.ajax({  // grabs the card data from get request in the database
        type: 'GET',
        url: '/play/decksinformat',
        data: formatSelection,
        success: function(deckResult) { 
            let deckResultObj=JSON.parse(JSON.stringify(deckResult));
            const deckResultArray=Object.values(deckResultObj);
            
            
            calcCards(deckResultArray);
            
        },
        contentType: 'application/json',
        dataType: 'JSON'
    })
    
    
}

function calcCards(deckResultArr){
    for (let i=0; i<deckResultArr.length;i++){
        for(let j=i+1;j<deckResultArr.length;j++){  
            let deck1=[];
            let deck2=[];
            let combinedDecks=[];
            let condensedDecks=[];
            let instanceCounter=[];
            let concat=[];
            deck1=Object.values(JSON.parse(JSON.stringify(deckResultArr[i].cards)));
            deck2=Object.values(JSON.parse(JSON.stringify(deckResultArr[j].cards)));
            concat=deck1.concat(deck2);
            concat.forEach(deck=>{
                combinedDecks.push(deck)
            })
                for(let k=0; k<combinedDecks.length; k++){
                    for(let l=k+1;l<combinedDecks.length;l++){
                        if(combinedDecks[k].id===combinedDecks[l].id){
                            combinedDecks[k].instances=String(Number(combinedDecks[k].instances)+Number(combinedDecks[l].instances));
                            combinedDecks.splice(l--,1);
                        }
                        else{}
                    }
                }
                for(let m=0; m<combinedDecks.length; m++){
                    if (combinedDecks[m].instances!=="0"){
                        condensedDecks.push(combinedDecks[m]);
                    }
                }
                let condensedObject=Object.assign({}, condensedDecks);
                $.ajaxSetup({ cache: false });
                $.ajax({  // grabs the card data from get request in the database
                    type: 'GET',
                    url: '/play/submit',
                    data: condensedObject,
                    success: function(cardResult) { 
                        let cardResultArr=Object.values(cardResult);
                        calcResult(condensedDecks,cardResultArr,deckResultArr[i].deckName,deckResultArr[j].deckName);
                    },
                    contentType: 'application/json',
                    dataType: 'JSON'
                }); 
        }
    }    
}       

function calcResult(cardReq,cardRes,deckName1,deckName2){ //crazy ass long ass for loop to compare the requested cards from the deck selection (missing too much shit) to the cards returned from the db
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
            combinedResult.push({name:res.name,id:res.id,imageUrl:res.imageUrl,inventory:inventory,duplicateprints:res.duplicateprints,deckInstances:Number(req.instances),missingCards:missingCards,set:res.set,number:res.number})
            }
            else{}
        })
    });
    drawResult(combinedResult,deckName1,deckName2);

}
function drawResult(combinedResult,deckName1,deckName2){
    document.querySelectorAll('carddiv').forEach(e => e.remove());
    for(let i =0; i<combinedResult.length;i++){
        if(combinedResult[i].missingCards >0 ){
            if(document.getElementById(combinedResult[i].id) == null){
                let cardName = document.createElement('div');
                cardName.innerText=combinedResult[i].name+" /// "+combinedResult[i].set+ " #"+combinedResult[i].number;
                cardName.setAttribute("id",combinedResult[i].id)
                cardName.setAttribute("class","carddiv");
                document.getElementById("cards").appendChild(cardName);
            }
            else {}
            let deckVersus = document.createElement('p');
            deckVersus.innerText=deckName1+" vs "+deckName2+" you're missing "+combinedResult[i].missingCards;
            deckVersus.setAttribute("class","deckVersus");
            document.getElementById(combinedResult[i].id).appendChild(deckVersus);
        }
    }
    
}