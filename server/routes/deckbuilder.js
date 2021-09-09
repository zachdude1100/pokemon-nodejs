const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');

router.get("/",(req,res)=>{
    res.render("deck_builder_home"); 
 
})

router.post("/savedeck",(req,res)=>{
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

router.get("/searchcard",(req,res)=>{
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

module.exports = router;