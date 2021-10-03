const express = require('express');
const router = express.Router();
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');
const {ensureAuth,ensureGuest}=require('../middleware/auth')

const playController = require('../controllers/play.controller');

router.get("/",ensureAuth,(req,res)=>{
    res.render("format_calculation");
})
router.get("/extracards",ensureAuth,(req,res)=>{
    Card.find()
    .then((allCardsArr)=>{  //tallies up the total inventory including duplicates
        let arr=[];
        allCardsArr.forEach(card =>{
            let inventory = card.inventory;
            card.duplicateprints.forEach(dupe=>{  //all reprints end up with the same tally of cards, so we can ignore
                index = allCardsArr.findIndex(x=> x.id === dupe)
                if (index != -1){
                    inventory += allCardsArr[index].inventory
                }
            })
            arr.push({id:card.id,inventory:inventory,duplicateprints:card.duplicateprints,name:card.name,set:card.set}) //new array with all printings of cards to be full inventory of that printing
        })
        return arr;
    })
    .then((cardInventory)=>{
        Deck.find({format:"Base_Jungle"})
        .then((foundDecks)=>{
            let allCards=[]
            foundDecks.forEach(deck=>{
                var values = Object.values(deck.cards)
                
                allCards.push(values)
            })
            let allCardsMerged=[].concat.apply([],allCards) //all Cards in the format put into one array of card objects
            allCardsMerged.forEach(card=>{
                let index = cardInventory.findIndex(x=>x.id===card.id)             // no matter which card is put into the deck it gets transformed into the alphabetically first card + dupe just so the calcs are easier
                let cardPlusDupesIds=[];
                cardPlusDupesIds=[].concat.apply([],[cardInventory[index].id,cardInventory[index].duplicateprints]);
                cardPlusDupesIds.sort();
                card.id=cardPlusDupesIds[0] 
            })
            let unique = [...new Set(allCardsMerged.map(item => item.id))]; //grabs all unique card id's
            let deckRequiredInventory=[];
            unique.forEach(uniqueCardId=>{
                let cardsFiltered=allCardsMerged.filter(obj =>{     //filter unique card in each deck into array of arrays of the card id's
                    return obj.id === uniqueCardId
                })
                let largestA=0;     //largest amount of cards needed for two decks vs each other
                let largestB=0;
                cardsFiltered.forEach(card=>{ 
                    if (card.instances > largestA){
                        largestB=largestA
                        largestA=card.instances
                    }
                    else if (card.instances > largestB){
                        largestB=card.instances
                    }
                })
                let instances = +largestA + +largestB;
                deckRequiredInventory.push({id:uniqueCardId,instances:instances})
            })
            return deckRequiredInventory
        })
        .then((deckRequiredInventory)=>{
            resultArr=[]
            cardInventory.forEach(card=>{
                let index = deckRequiredInventory.findIndex(x=>x.id===card.id)
                if (index >-1){
                    resultArr.push({id:card.id,instances:deckRequiredInventory[index].instances,inventory:card.inventory,name:card.name,set:card.set,duplicateprints:card.duplicateprints})
                }
                if (index ==-1){
                    let toBeAdded=true;
                    card.duplicateprints.forEach(print=>{
                        let j = deckRequiredInventory.findIndex(x=>x.id===print)  //if there is a duplicate printing in the deckRequiredInventory, don't add this card
                        if(j>-1){
                            toBeAdded=false;
                        }
                        let k = resultArr.findIndex(x=>x.id===print)
                        if(k>-1){
                            toBeAdded=false;
                        }
                    })
                    if(toBeAdded===true){
                        resultArr.push({id:card.id,instances:0,inventory:card.inventory,name:card.name,set:card.set,duplicateprints:card.duplicateprints}) 
                    }
                }
            })
            resultArr.forEach(card=>{
                if (card.inventory > card.instances){
                    let surplus = card.inventory - card.instances;
                    //console.log("you have " +surplus+ " too many " + card.name+" from "+card.set)
                }
                if (card.inventory < card.instances){
                    let deficit = card.instances - card.inventory;
                    console.log("you are missing " + deficit+" "+card.name+" from "+card.set)
                }
            })
        })
    })
});
router.get("/extracardstest",ensureAuth,playController.playCalc)

module.exports = router;