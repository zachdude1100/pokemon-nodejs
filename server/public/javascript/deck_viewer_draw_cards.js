function drawcards(cardsOnScreen){
    document.querySelectorAll('.card').forEach(e => e.remove());
    for (let i = 0; i < cardsOnScreen.length; i++){
            let cardDiv = document.createElement('div');
            cardDiv.setAttribute("class","carddiv");
            cardDiv.setAttribute("id","carddiv"+''+i+'')
            document.getElementById("cards").appendChild(cardDiv);
            let cardImage = document.createElement('img');
            cardImage.src = cardsOnScreen[i].imageUrl;
            cardImage.setAttribute("class","card")
            cardImage.setAttribute("id",''+cardsOnScreen[i].id+'');
            document.getElementById("carddiv"+''+i+'').appendChild(cardImage);
            let cardInstances = document.createElement('p');
            cardInstances.innerText="x"+cardsOnScreen[i].instances;
            cardInstances.setAttribute("class","instances");
            document.getElementById("carddiv"+''+i+'').appendChild(cardInstances);
    }
    
}