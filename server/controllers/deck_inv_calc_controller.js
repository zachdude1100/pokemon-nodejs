const express = require('express');
const User = require("../models/User.js")
const Card = require('../models/card.js');
const DeckV2 = require('../models/deckv2.js')
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

module.exports.getUserDecksAndInv=(req,res,next)=>{
    DeckV2.find({$and:[{userID:req.user.id},{format:req.query.formatselection}]})
    .populate('cards.card').exec((err,decks)=>{
        let decksArr=[]
        let uniteArg=[]
        for (let deck of decks){ //build a deck array with the usable and needed data
            let cardsArr=[]
            for (let card of deck.cards){
                let prints=card.card.duplicateprints.concat(card.card.id)
                prints.sort()
                cardsArr.push({id:card.card.id,prints:prints,instances:card.instances})
                uniteArg.push(prints)   //creating an argument array to find unique cards needed for these decks
            }
            decksArr.push({_id:deck._id,deckName:deck.deckName,cards:cardsArr})
        }
        let unitedArr=unite(...uniteArg) //unite the prints arrays into one with removed dupes
        User.findOne({_id:req.user.id})
        .then((user)=>{
            let cardInvArr=[]
            for(let card of user.cards){
                cardInvArr.push({id:card.id,name:card.name,imageUrl:card.imageUrl,playSetInv:card.playSetInv})
            }
            let filteredInvArr = cardInvArr.filter(item=> unitedArr.includes(item.id)) //filter the cardInvArr by the deck united Arr. No sense in returning all the cards when we can filter it out here
            return res.json({decksArr,filteredInvArr})

        })
    })
}


function unite() {  //function to "unite" multiple arrays as arguments and pull out unique values
    return [].concat.apply([], arguments).filter(function(elem, index, self) {
        return self.indexOf(elem) === index;
    });
}