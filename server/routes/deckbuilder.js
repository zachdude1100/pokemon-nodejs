const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');
const User = require('../models/User.js')
const crypto = require('crypto')
const {ensureAuth,ensureGuest}=require('../middleware/auth')

router.get("/",ensureAuth,(req,res)=>{
    res.render("deck_builder_home"); 
 
})

router.post("/savedeck",ensureAuth,(req,res)=>{
    const newDeck = new Deck({
        deckName: req.body.deckName,
        notes: req.body.notes,
        format: req.body.format,
        cards: req.body.cards
    });
    Deck.create(newDeck)
    .catch((err)=>{
        console.log(err)
    })
});

router.get("/searchcard",ensureAuth,(req,res)=>{
    query=Object.keys(req.query)[0];    
    if (query != undefined &&query.length > 2){
        Card.find({"name":{$regex:".*"+query+".*","$options":"i"}})
        .exec()
            .then((foundCards) =>{
                return res.json(foundCards)
        })
    }
    else{
        return res.json([])
    }

    

})
router.post("/savedecknew",ensureAuth,(req,res)=>{
    const newDeck ={
        id:crypto.randomBytes(16).toString("hex"),
        deckName: req.body.deckName,
        notes: req.body.notes,
        format: req.body.format,
        cards: req.body.cards
    };
    User.findOneAndUpdate({googleId:req.user.googleId},{$addToSet:{decks:newDeck}},function(err,doc){
        if (err) return res.send(500, {error:err});
     })
     .then((err)=>{
         res.redirect('/deckbuilder');
     })
});

/*router.post("/transferdecks",(req,res)=>{ //temporary to populate my account with all the previously created decks
    Deck.find()
    .then((decks)=>{
        decks.forEach((deck)=>{
            const newDeck ={
                id:crypto.randomBytes(16).toString("hex"),
                deckName: deck.deckName,
                notes: deck.notes,
                format: deck.format,
                cards: deck.cards
            };
            User.findOneAndUpdate({googleId:"112789900518745656228"},{$addToSet:{decks:newDeck}},function(err,doc){
                if (err) return res.send(500, {error:err});
             })
        })
    })
});*/
module.exports = router;