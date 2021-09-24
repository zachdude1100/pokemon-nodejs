$.ajax({  
    type: 'GET',
    url: '/tcg/queryexistinggamestates',
    success: function(ActiveGames) { 
        console.log(ActiveGames)
        let ActiveGamesArr=Object.values(ActiveGames);
        ActiveGamesArr.forEach(game=>{
        let UUID = document.createElement('option');
        UUID.setAttribute("name",game.gameStateName);
        UUID.innerText=game.gameStateName;
        UUID.onclick=function(){hideNewGameInput()};
        document.getElementById("gameselection").appendChild(UUID);
        });
    },
    contentType: 'application/json',
    dataType: 'JSON'
});  

function setOptions()
{        
    document.getElementById('deckselection').options.length = 0; // remove all options
    let formatSelection=document.getElementById('formatselection').value;
        let deckName = document.createElement('option');
        deckName.setAttribute("name","placeholder");
        deckName.innerText="select a deck";
        document.getElementById("deckselection").appendChild(deckName);

        $.ajax({  // grabs the card data from get request in the database
            type: 'GET',
            url: '/tcg/decksinformat',
            data: formatSelection,
            success: function(deckResult) { 
                let deckResultArr=Object.values(deckResult);
                deckResultArr.forEach(deck=>{
                let deckName = document.createElement('option');
                deckName.setAttribute("name",deck.deckName);
                deckName.innerText=deck.deckName;
                document.getElementById("deckselection").appendChild(deckName);
                });
            },
            contentType: 'application/json',
            dataType: 'JSON'
        });     
}

function showNewGameInput(){
    document.getElementById("gamename").className="visible"
}
function hideNewGameInput(){
    document.getElementById("gamename").className="hidden"
}