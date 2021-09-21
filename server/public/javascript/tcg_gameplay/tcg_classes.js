

class Card{
    constructor(cardId,imageUrl){
        this._id= Math.random().toString(36).substr(2, 16) //generate and add a random unique (hopefully) id
        this.id=cardId
        this.imageUrl=imageUrl
        this.inDeck=false;
        this.inDiscard=false;
        this.inPrizes=false;
        this.inHand=false;
    }
}

class Hand {
    constructor(){
        this.cards=[];
        this.quantity=0;
    }
}

class Deck {
  constructor(){
      this.cards=[];
      this.quantity=0;
  }
  initDeck(rawDeck){  //new game only, generate 60 cards
      rawDeck.forEach(cardInDeck => {
          var instances=cardInDeck.instances;
          for (let i=0;i<instances;i++){
            let card = new Card(cardInDeck.id,cardInDeck.imageUrl)
            card.inDeck=true;
            this.cards.push(card);
            this.quantity++;
          }
      });
  }
  shuffleDeck(){
    var cardsInDeck =[];
    this.cards.forEach(card=>{ //identifies the cards that are actually in the deck, not hand or prize or discard
        if (card.inDeck===true){
            cardsInDeck.push(card);
        }
    })
    var newDeck = [];
    for (var i = 0; i < cardsInDeck.length; i++) {  
        var rand = Math.floor(Math.random() * (i + 1));  
        newDeck[i] = newDeck[rand];
        newDeck[rand] = cardsInDeck[i];
    }
    this.deck=newDeck; //write back into deck
    drawCardFromDeck() //TEMP
    }
    
}