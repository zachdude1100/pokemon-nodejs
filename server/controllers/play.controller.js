const express = require('express');
const router = express.Router();
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');


module.exports.playCalc =(req,res,next) => {
Card.find()
    .then((allCardsArr)=>{  //tallies up the total inventory including duplicates with inventory greater than 0
        let arr=[];
        allCardsArr.forEach(card =>{ //cycles through each card
            let inventory = card.inventory;
            let reprintsArr = [card.id]; //inital value of the reprints should be the base card
            let reprintsSorted=[card.id]; //^ same here
            card.duplicateprints.forEach(dupe=>{  //all reprints = sum of inventory of all of the reprints
                let index = allCardsArr.findIndex(x=> x.id === dupe)
                if (index != -1){ //if the card exists in the inital array
                    inventory += allCardsArr[index].inventory //+= the inventory of that card to the sum of this card and its prints
                }
                reprintsArr.push(dupe) //pushes each reprint to the array of reprints
                reprintsSorted = reprintsArr.sort(); //sorts the reprints alphabetically
            })
            let toBeAdded = true //bool to track whether or not to build out the card
                arr.forEach(card=>{ //checks each card in the output array to see if it's already there
                    if(card.id.equals(reprintsSorted)){ //if it is, don't add it
                        toBeAdded=false
                    }
                })
            if (toBeAdded == true){ //checks if it should be added or not. Default = yeeeee
                arr.push({id:reprintsSorted,inventory:inventory,name:card.name,set:card.set,imageUrl:card.imageUrl,imageUrlHiRes:card.imageUrlHiRes}) //new array with all printings of cards to be full inventory of that printing
            }
        })
        //console.log(arr)
        return res.json(arr);
    })
    /*.then(condensedArrGt0=>{
        Card.find({inventory:0})
        .then
    })*/
}




// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});