function drawcards(allCardsInSet,userCardsInSet){
    let cardsOnScreen=allCardsInSet;
    document.querySelectorAll('.card').forEach(e => e.remove());
    for (let i = 0; i < cardsOnScreen.length; i++){
            let cardDiv = document.createElement('div');
            cardDiv.setAttribute("class","carddiv");
            cardDiv.setAttribute("id","carddiv"+''+i+'')
            document.getElementById("cards").appendChild(cardDiv);
            
            let cardDivLeft = document.createElement('div');
            cardDivLeft.setAttribute("class","carddivleft");
            cardDivLeft.setAttribute("id","carddivleft"+''+i+'')
            document.getElementById("carddiv"+''+i+'').appendChild(cardDivLeft);

            let cardDivRight = document.createElement('div');
            cardDivRight.setAttribute("class","carddivright");
            cardDivRight.setAttribute("id","carddivright"+''+i+'')
            document.getElementById("carddiv"+''+i+'').appendChild(cardDivRight);

            let cardAnchor = document.createElement('A');
            cardAnchor.href = cardsOnScreen[i].imageUrlHiRes
            cardAnchor.setAttribute("id",cardsOnScreen[i].id+i+'anchor');
            cardAnchor.setAttribute("class",'anchor');
            document.getElementById("carddivleft"+''+i+'').appendChild(cardAnchor);
            let cardImage = document.createElement('img');
            cardImage.src = cardsOnScreen[i].imageUrl;
            cardImage.setAttribute("class","card")
            cardImage.setAttribute("id",''+cardsOnScreen[i].id+'');
            document.getElementById(cardsOnScreen[i].id+i+'anchor').appendChild(cardImage);

            let cardName = document.createElement('p');
            cardName.innerText=cardsOnScreen[i].name;
            cardName.setAttribute("class","cardname");
            document.getElementById("carddivright"+''+i+'').appendChild(cardName);

            let cardNumber = document.createElement('p');
            cardNumber.innerText="Set number: "+cardsOnScreen[i].number;
            cardNumber.setAttribute("class","cardnumber");
            document.getElementById("carddivright"+''+i+'').appendChild(cardNumber);

            let playSetInvText = document.createElement('p');
            playSetInvText.innerText="Current Inventory: 0";
            playSetInvText.setAttribute("class","inventorycurrent");
            playSetInvText.setAttribute("id","playSetInvText_"+cardsOnScreen[i].id);
            document.getElementById("carddivright"+''+i+'').appendChild(playSetInvText);
            
            let cardForm = document.createElement('form');
            cardForm.setAttribute("class","inventoryform");
            cardForm.setAttribute("id","inventoryform"+''+i+'');
            cardForm.setAttribute("action","/inventory/submit");
            cardForm.setAttribute("method","POST");
            document.getElementById("carddivright"+''+i+'').appendChild(cardForm);
            
            let playSetInvInput = document.createElement('input');
            playSetInvInput.setAttribute("class","inventoryinput");
            playSetInvInput.setAttribute("name","playSetInvInput")
            playSetInvInput.setAttribute("id","playSetInvInput_"+cardsOnScreen[i].id)
            playSetInvInput.setAttribute("value",0);
            document.getElementById("inventoryform"+''+i+'').appendChild(playSetInvInput);
            
            let cardInventoryId = document.createElement('input');
            cardInventoryId.setAttribute("id",cardsOnScreen[i].id)
            cardInventoryId.setAttribute("name","id");
            cardInventoryId.setAttribute("value",cardsOnScreen[i]._id);
            cardInventoryId.setAttribute("type","hidden");
            document.getElementById("inventoryform"+''+i+'').appendChild(cardInventoryId);

            let cardInventorySubmit = document.createElement('button');
            cardInventorySubmit.setAttribute("id","inventorysubmit"+''+i+'')
            cardInventorySubmit.setAttribute("class","inventorysubmit");
            cardInventorySubmit.innerText="Update Inventory";
            document.getElementById("inventoryform"+''+i+'').appendChild(cardInventorySubmit);
    }
    for(i=0;i<userCardsInSet.length;i++){
        let playSetInvText=document.getElementById("playSetInvText_"+userCardsInSet[i].id)
        playSetInvText.innerText="Current Inventory: "+userCardsInSet[i].playSetInv;
        let playSetInvInput=document.getElementById("playSetInvInput_"+userCardsInSet[i].id)
        playSetInvInput.setAttribute("value",userCardsInSet[i].playSetInv);
    }
}