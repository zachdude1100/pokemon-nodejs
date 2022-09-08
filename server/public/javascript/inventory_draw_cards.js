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
            
            let cardForm = document.createElement('form');
            cardForm.setAttribute("class","inventoryform");
            cardForm.setAttribute("id","inventoryform"+''+i+'');
            cardForm.setAttribute("action","/inventory/submit");
            cardForm.setAttribute("method","POST");
            document.getElementById("carddivright"+''+i+'').appendChild(cardForm);

            let binderCondDiv= document.createElement('div');
            binderCondDiv.setAttribute("class","form-group");
            binderCondDiv.setAttribute("id","binderCondDiv_"+cardsOnScreen[i].id)
            document.getElementById("inventoryform"+''+i+'').appendChild(binderCondDiv);

            let binderCondInput = document.createElement('input');
            binderCondInput.setAttribute("class","inventoryinput");
            binderCondInput.setAttribute("name","binderCondInput")
            binderCondInput.setAttribute("id","binderCondInput_"+cardsOnScreen[i].id)
            binderCondInput.setAttribute("value","na");
            document.getElementById("binderCondDiv"+'_'+cardsOnScreen[i].id+'').appendChild(binderCondInput);

            let binderCondInputLabel = document.createElement('label');
            binderCondInputLabel.setAttribute("class","inventoryinputlabel");
            binderCondInputLabel.setAttribute("for","binderCondInputLabel_"+cardsOnScreen[i].id)
            binderCondInputLabel.setAttribute("id","binderCondInputLabel_"+cardsOnScreen[i].id)
            binderCondInputLabel.innerText="Binder Cond:";
            document.getElementById("binderCondDiv"+'_'+cardsOnScreen[i].id+'').appendChild(binderCondInputLabel);

            let playSetDiv= document.createElement('div');
            playSetDiv.setAttribute("class","form-group");
            playSetDiv.setAttribute("id","playSetDiv_"+cardsOnScreen[i].id)
            document.getElementById("inventoryform"+''+i+'').appendChild(playSetDiv);

            let playSetInvInput = document.createElement('input');
            playSetInvInput.setAttribute("class","inventoryinput");
            playSetInvInput.setAttribute("name","playSetInvInput")
            playSetInvInput.setAttribute("id","playSetInvInput_"+cardsOnScreen[i].id)
            playSetInvInput.setAttribute("value",0);
            document.getElementById("playSetDiv"+'_'+cardsOnScreen[i].id+'').appendChild(playSetInvInput);

            let playSetInvInputLabel = document.createElement('label');
            playSetInvInputLabel.setAttribute("class","inventoryinputlabel");
            playSetInvInputLabel.setAttribute("for","playSetInvInput_"+cardsOnScreen[i].id)
            playSetInvInputLabel.setAttribute("id","playSetInvInputLabel_"+cardsOnScreen[i].id)
            playSetInvInputLabel.innerText="PlaySet Inv:";
            document.getElementById("playSetDiv"+'_'+cardsOnScreen[i].id+'').appendChild(playSetInvInputLabel);

            let bulkDiv= document.createElement('div');
            bulkDiv.setAttribute("class","form-group");
            bulkDiv.setAttribute("id","bulkDiv_"+cardsOnScreen[i].id)
            document.getElementById("inventoryform"+''+i+'').appendChild(bulkDiv);

            let bulkInvInput = document.createElement('input');
            bulkInvInput.setAttribute("class","inventoryinput");
            bulkInvInput.setAttribute("name","bulkInvInput")
            bulkInvInput.setAttribute("id","bulkInvInput_"+cardsOnScreen[i].id)
            bulkInvInput.setAttribute("value",0);
            document.getElementById("bulkDiv"+'_'+cardsOnScreen[i].id+'').appendChild(bulkInvInput);

            let bulkInvInputLabel = document.createElement('label');
            bulkInvInputLabel.setAttribute("class","inventoryinputlabel");
            bulkInvInputLabel.setAttribute("for","bulkInvInput_"+cardsOnScreen[i].id)
            bulkInvInputLabel.setAttribute("id","bulkInvInputLabel_"+cardsOnScreen[i].id)
            bulkInvInputLabel.innerText="Bulk Inv:";
            document.getElementById("bulkDiv"+'_'+cardsOnScreen[i].id+'').appendChild(bulkInvInputLabel);
            
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
    for(i=0;i<userCardsInSet.length;i++){ //populates the current inventory of each card
        let binderCondInput=document.getElementById("binderCondInput_"+userCardsInSet[i].id)
        binderCondInput.setAttribute("value",userCardsInSet[i].binderCond);
        let playSetInvInput=document.getElementById("playSetInvInput_"+userCardsInSet[i].id)
        playSetInvInput.setAttribute("value",userCardsInSet[i].playSetInv);
        let bulkInvInput=document.getElementById("bulkInvInput_"+userCardsInSet[i].id)
        bulkInvInput.setAttribute("value",userCardsInSet[i].bulkInv);
    }

    let downloadForm = document.getElementById('downloadForm');
    downloadForm.setAttribute("action","/inventory/"+allCardsInSet[0].setCode+"/download");

    let downloadFormInput= document.createElement('input')
    downloadFormInput.setAttribute("type","hidden")
    downloadFormInput.setAttribute("name","setcode")
    downloadFormInput.setAttribute("id","downloadFormInput")
    downloadFormInput.setAttribute("value",allCardsInSet[0].setCode)
    document.getElementById("downloadForm").appendChild(downloadFormInput)

    let downloadFormSubmit = document.createElement('button')
    downloadFormSubmit.innerText="Download CSV"
    downloadFormSubmit.setAttribute("id","downloadFormSubmitButton")
    downloadFormSubmit.setAttribute("name","downloadFormSubmitButton")
    document.getElementById("downloadForm").appendChild(downloadFormSubmit)
}