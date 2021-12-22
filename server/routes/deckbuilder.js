const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const DeckV2 = require('../models/deckv2.js');
const Card = require('../models/card.js');
const User = require('../models/User.js')
const crypto = require('crypto')
const {ensureAuth,ensureGuest}=require('../middleware/auth')

router.get("/",ensureAuth,(req,res)=>{
    res.render("deck_builder_home"); 
 
})
router.get("/format/:format",ensureAuth,(req,res)=>{
    res.render("deck_builder_builder",{format:req.params.format});
})
router.get("/searchcard",ensureAuth,(req,res)=>{
    query=Object.values(req.query)[0];  
    formatSelected=Object.values(req.query)[1];   
    if (query != undefined &&query.length > 2){
        Card.find({$and:[{"name":{$regex:".*"+query+".*","$options":"i"}},{legalFormats:formatSelected}]})
        .exec()
            .then((foundCards) =>{
                return res.json(foundCards)
        })
    }
    else{
        return res.json([])
    }
});

router.post("/savedeck",ensureAuth,(req,res)=>{
    let cardIdArr=[]
    let cardCount=0;
    for (let card of req.body.cards){
        card._id=mongoose.Types.ObjectId(card._id) //turns the _id into a mongoose object_id
        cardIdArr.push(card._id)
        if (isNaN(Number(card.instances))===true){ //validate that number was entered
            res.status(400)
            break
        }
        cardCount=cardCount+Number(card.instances)
    }
    if (cardCount!==60){ //validate 60 cards
        res.status(400)
        res.send('Need 60 cards try again')
    }
    Card.find({_id:{$in:cardIdArr}})
    .then((cards)=>{
        if (cards.length!=cardIdArr.length){    //validates the id of the cards, if all card documents aren't found, the card id has been tampered
            res.status(400)
            return false;
        }
        else{
            return true;
        }
    })
    .then((create)=>{
        if(create===true){
            //const cards = req.body.cards.map(({id,imageUrl,...remainingAttrs})=>remainingAttrs) //strips id and imageUrl from data, don't need it
            let cards=[]
            for (let card of req.body.cards){
                cards.push({card:card._id,instances:card.instances})
            }
            const newDeck ={
            userID:req.user.id,
            deckName: req.body.deckName,
            notes: req.body.notes,
            format: req.body.format,
            cards: cards 
            };
            DeckV2.create(newDeck)
            return
        }
    })
    .then(()=>{
        res.status(200).send()
    })
});
module.exports = router;