class Deck {
  constructor(rawDeck,gameUUID){
      var deck=[];
      rawDeck.forEach(card => {
          var instances=card.instances;
          for (let i=0;i<instances;i++){
              var rand = Math.random().toString(36).substr(2, 16) //generate and add a random unique (hopefully) id
              deck.push({id: card.id,imageUrl:card.imageUrl, _id:rand}) //smack some objects in that deck
          }
      });
      this.deck=deck;
  }
  shuffle(){
    var newDeck = [];
    for (var i = 0; i < this.deck.length; i++) {    
        var rand = Math.floor(Math.random() * (i + 1));  
        newDeck[i] = newDeck[rand];
        newDeck[rand] = this.deck[i];
    }
    this.deck=newDeck; //write back into deck
    drawCardFromDeck()
    }
}