const express = require('express');
var crypto = require("crypto");
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');


router.get("/",(req,res)=>{
    res.render("tcg_game_home"); 
})
router.get("/:format",(req,res)=>{
    Deck.find({'format': req.params.format})
    .exec()
    .then((foundDecks)=>{
        res.render("tcg_game_deckselection",{Deck: foundDecks});
    })
    .catch((err)=>{
        res.redirect("/tcg")
        console.log(err)
    })
})
router.get("/deck/:id",(req,res)=>{
    Deck.findById(req.params.id)
    .exec()
    .then((foundDecks)=>{
        var gameUUID=crypto.randomBytes(20).toString('hex');
        res.render("tcg_game_play",{Deck: foundDecks,gameUUID:gameUUID});
    })
    .catch((err)=>{
        res.redirect("/tcg")
        console.log(err)
    })
})

router.post("/updateGameState/:gameUUID",(req,res)=>{

})


module.exports = router;