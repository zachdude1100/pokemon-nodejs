refreshGameStates();

function refreshGameStates(){
    $.ajax({  
        type: 'GET',
        url: '/tcg/queryexistinggamestates',
        success: function(ActiveGames) { 
            $("#open-gamestate-name").html(""); //clears all div contents before refreshing data
            $("#open-gamestate-user").html("");
            $("#open-gamestate-format").html("");
            $("#open-gamestate-deckname").html("");
            $("#open-gamestate-join").html("");
            let ActiveGamesArr=Object.values(ActiveGames);
            ActiveGamesArr.forEach(game=>{
            let gameStateName = document.createElement('p');
            gameStateName.innerText=game.gameStateName;
            document.getElementById("open-gamestate-name").appendChild(gameStateName);
            let opponentName = document.createElement('p');
            opponentName.innerText=game.playerOneName;
            document.getElementById("open-gamestate-user").appendChild(opponentName);
            let format = document.createElement('p');
            format.innerText=game.format;
            document.getElementById("open-gamestate-format").appendChild(format);
            let deckName = document.createElement('p');
            deckName.innerText=game.playerOneDeckName;
            document.getElementById("open-gamestate-deckname").appendChild(deckName);
            let button = document.createElement('button')
            button.setAttribute("type","submit")
            button.setAttribute("id","join_"+game.gameStateUUID)
            button.setAttribute("onclick","joingame('"+game.gameStateUUID+"')")
            button.innerText="Join this game";
            document.getElementById("open-gamestate-join").appendChild(button);
            });
        },
        contentType: 'application/json',
        dataType: 'JSON'
    });  
}
function joingame(gameStateUUID){
    let formatselection=document.getElementById("formatselection");
    let deckselection=document.getElementById("deckselection");

    if(deckselection.value!=null&&deckselection.value!="Select format first"&&deckselection.value!="select a deck"){
        const form = document.createElement('form')
        form.method='post'
        form.action='/tcg/joingame'
        const hiddengameselection=document.createElement("input")
        hiddengameselection.type ='hidden';
        hiddengameselection.name='gameselection'
        hiddengameselection.value=gameStateUUID
        const hiddenname=document.createElement("input")
        hiddenname.type ='hidden';
        hiddenname.name='playerName'
        hiddenname.value=name;
        form.appendChild(hiddenname)
        form.appendChild(hiddengameselection)
        form.appendChild(formatselection)
        form.appendChild(deckselection)
        document.body.appendChild(form);
        form.submit();
    }
}

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


