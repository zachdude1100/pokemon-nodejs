const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const User = require('../models/User.js');
const {ensureAuth,ensureGuest}=require('../middleware/auth')

/*router.get("/",ensureAuth,(req,res)=>{
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

router.get("/:format",ensureAuth,(req,res)=>{
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
router.get("/deck/:id",ensureAuth,(req,res)=>{
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


router.post("/delete/:id",ensureAuth,(req,res)=>{
    Deck.findByIdAndDelete(req.params.id)
    .exec()
    .then(res.redirect("/deckviewer"))
    .catch((err)=>{
        console.log(err)
    })
});*/

router.get("/",ensureAuth,(req,res)=>{
    User.findOne({googleId:req.user.googleId})
    .then((user)=>{
        res.render("deck_viewer_home",{Deck: user.decks});
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
    })
})

router.get("/:format",ensureAuth,(req,res)=>{
    User.findOne({googleId:req.user.googleId})
    .then((user)=>{
        var decksInFormat=[]
        user.decks.forEach((deck)=>{
            if (deck.format==req.params.format){
                decksInFormat.push(deck)
            }
        })
        res.render("deck_viewer_format",{Deck: decksInFormat});
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
    })
})
router.get("/deck/:id",ensureAuth,(req,res)=>{
    User.findOne({googleId:req.user.googleId})
    .then((user)=>{
        for (i=0;i<user.decks.length;i++){
            if (user.decks[i].id==req.params.id){
                res.render("deck_viewer_deck",{Deck: user.decks[i]});
            }
        }
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
    })
})


router.post("/delete/:id",ensureAuth,(req,res)=>{
    User.findOneAndUpdate({googleId:req.user.googleId},{$pull:{decks:{id:req.params.id}}})
    .then(res.redirect("/deckviewer"))
    .catch((err)=>{
        console.log(err)
    })
});


module.exports = router;