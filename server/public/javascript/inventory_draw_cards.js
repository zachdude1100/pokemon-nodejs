function drawcards(foundCards){
    let cardsOnScreen=foundCards;
    console.log(cardsOnScreen)
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

            let cardInventoryCurrent = document.createElement('p');
            cardInventoryCurrent.innerText="Current Inventory: "+cardsOnScreen[i].inventory;
            cardInventoryCurrent.setAttribute("class","inventorycurrent");
            document.getElementById("carddivright"+''+i+'').appendChild(cardInventoryCurrent);
            
            let cardForm = document.createElement('form');
            cardForm.setAttribute("class","inventoryform");
            cardForm.setAttribute("id","inventoryform"+''+i+'');
            cardForm.setAttribute("action","/inventory/submit");
            cardForm.setAttribute("method","POST");
            document.getElementById("carddivright"+''+i+'').appendChild(cardForm);
            
            let cardInventoryInput = document.createElement('input');
            cardInventoryInput.placeholder="Update inventory";
            cardInventoryInput.setAttribute("class","inventoryinput");
            cardInventoryInput.setAttribute("name","inventoryinput")
            cardInventoryInput.setAttribute("value",cardsOnScreen[i].inventory);
            document.getElementById("inventoryform"+''+i+'').appendChild(cardInventoryInput);
            
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
    
}