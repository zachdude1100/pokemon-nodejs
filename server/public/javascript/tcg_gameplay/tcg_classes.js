class Card{
    constructor(cardId,imageUrl){
        this.id= Math.random().toString(36).substr(2, 16) //generate and add a random unique (hopefully) id
        this.imageUrl=imageUrl
    }
}

class Discard {
    constructor(){
        this.cards=[];
        this.quantity=0;
    }
    addCardToDiscard(id,src){
        this.cards.push({id:id,imageUrl:src})
        this.quantity++;
    }
}
class Prizes {
    constructor(){
        this.cards=[];
        this.quantity=0;
    }
    initPrizes(){
        for(let i=0;i<6;i++){
            this.cards.push(deck.cards[i]);
            deck.cards.splice(0,1)
            deck.quantity--
            this.quantity++;
        }
        this.animatePrizes()
    }
    animatePrizes(){
        if (this.quantity >0){
            var prizes = document.getElementById("prizes")
            prizes.setAttribute("src","/images/prizes_"+this.quantity+".png")
        }
        else{
            var prizes = document.getElementById("prizes")
            prizes.setAttribute("src","/images/winner.jpg") //you win
        }
        
    }
    drawPrize(){
        if (this.quantity >0){
            hand.addCardToHand(this.cards[0].id,this.cards[0].imageUrl)
            this.cards.splice(0,1);;
            this.quantity--;
            this.animatePrizes()
        }
        
    }
}

class Hand {
    constructor(){
        this.cards=[];
        this.quantity=0;
    }
    animate(){
        document.querySelectorAll('.card').forEach(e => e.remove()); //removes all before redrawing (laziness)
        for (let i = 0; i < this.cards.length; i++){
            let cardImage = document.createElement('img');
            cardImage.src = this.cards[i].imageUrl;
            cardImage.setAttribute("class","card")
            cardImage.setAttribute("id",this.cards[i].id);
            cardImage.oncontextmenu = function () {
              showContextMenu(cardImage.id,"hand");
              //The return kills the normal context menu
              return false;
            }
            document.getElementById("hand").appendChild(cardImage);
        }
    }

    placeCardInPlay(cardId,cardSrc){
        let imageObj= new Image();
        imageObj.src=cardSrc
        imageObj.id=cardId
        drawCardOnCanvas(imageObj,stage.width() / 2 - 200 / 2,stage.height() / 2 - 137 / 2) //arbitrary placement
        for (let i = 0; i<this.cards.length;i++){ //iterates thru hand
            if (this.cards[i].id === cardId){
                this.cards.splice(i,1); //remove it
                this.quantity--;
                this.animate()
                break;
            }
            else{}
        }
    }
    viewCardModal(id,src){
        // Get the modal
        var modal = document.getElementById("cardModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = document.getElementById(id);
        console.log(img)
        var modalImg = document.getElementById("img01");
        modal.style.display = "block";
        modalImg.src = src;
    }
    hideCardModal(){
        var modal =document.getElementById("cardModal");
        modal.style.display = "none";
    }
    addCardToHand(id,src){
        this.cards.push({id:id,imageUrl:src})
        this.quantity++;
        this.animate();
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
            this.cards.push(card);
            this.quantity++;
          }
      });
      console.log(this.cards)
      this.shuffleDeck()
      prizes.initPrizes();
  }
    shuffleDeck(){
        var newDeck = [];
        for (var i = 0; i < this.cards.length; i++) {  
            var rand = Math.floor(Math.random() * (i + 1));  
            newDeck[i] = newDeck[rand];
            newDeck[rand] = this.cards[i];
        }   
        this.cards=newDeck; //write back into deck
        this.drawCard()
    }
    drawCard(){
        if (this.cards.length>0){
            hand.cards.push(this.cards[0]);
            hand.quantity++
            this.cards.splice(0,1)
            this.quantity--    
            hand.animate()  
        }
        else alert("Deck out! You lose!")
          
    }
    
}