const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const DeckV2 = require('../models/deckv2.js')
const Card = require('../models/card.js');
const User = require('../models/User.js')
const crypto = require('crypto')
const deckCalcController = require('../controllers/deck_inv_calc_controller.js');
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

router.get("/",ensureAuth,(req,res)=>{
    res.render('deck_calculation_home.ejs')
})

router.get("/getDecks",ensureAuth,deckCalcController.getUserDecks)

/*router.get("/zachsdecks",(req,res)=>{
    Deck.find()
    .then((decks)=>{
        let yeOlde = iterateDecks(decks)
        return yeOlde
    })
    .then((yeOlde)=>{
        
    })
})

async function iterateDecks(decks){
    let decksObjs=[]
    for await (let elem of decks){
        let cards = Object.values(elem.cards)
            let allCardsInThisDeck= await allCardsInDeck(cards)
            const deckObj={
                userID:"615a398700b7576b68a585c0",
                deckName: elem.deckName,
                notes: elem.notes,
                format: elem.format,
                cards: allCardsInThisDeck
            }
            console.log(decksObjs)
            decksObjs.push(deckObj)
            DeckV2.create(deckObj)
    }
    return await decksObjs
            
    
}

async function allCardsInDeck(cards){
    let cardObjIds=[]
    for(let card of cards){
        await Card.findOne({id:card.id})
                .then((foundCard)=>{
                    cardObjIds.push({card:foundCard._id,instances:card.instances});
                })
    }   
    return await cardObjIds
}
*/
module.exports=router