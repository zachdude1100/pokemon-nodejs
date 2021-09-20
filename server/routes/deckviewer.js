const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');

router.get("/",(req,res)=>{
    Deck.find()
    .exec()
    .then((foundDecks)=>{
        res.render("deck_viewer_home",{Deck: foundDecks});
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
    })
})

router.get("/:format",(req,res)=>{
    Deck.find({'format': req.params.format})
    .exec()
    .then((foundDecks)=>{
        res.render("deck_viewer_format",{Deck: foundDecks});
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
    })
})
router.get("/deck/:id",(req,res)=>{
    Deck.findById(req.params.id)
    .exec()
    .then((foundDecks)=>{
        res.render("deck_viewer_deck",{Deck: foundDecks});
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
    })
})


router.post("/delete/:id",(req,res)=>{
    Deck.findByIdAndDelete(req.params.id)
    .exec()
    .then(res.redirect("/deckviewer"))
    .catch((err)=>{
        console.log(err)
    })
});


module.exports = router;