$.ajax({  
    type: 'GET',
    url: '/tcg/queryexistinggamestates',
    success: function(ActiveGames) { 
        console.log(ActiveGames)
        let ActiveGamesArr=Object.values(ActiveGames);
        ActiveGamesArr.forEach(game=>{
        let UUID = document.createElement('option');
        UUID.setAttribute("value",game.gameStateUUID);
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
            data: {format:formatSelection},
            success: function(deckResult) { 
                let deckResultArr=Object.values(deckResult);
                deckResultArr.forEach(deck=>{
                let deckName = document.createElement('option');
                deckName.setAttribute("value",deck._id);
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
    changeFormAction("/tcg/newgame")
}
function hideNewGameInput(){
    document.getElementById("gamename").className="hidden"
    changeFormAction("/tcg/joingame")
}
function changeFormAction(action){
    document.getElementById("form").setAttribute("action",action)
}