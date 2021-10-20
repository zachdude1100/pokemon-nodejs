const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const {ensureAuth,ensureGuest}=require('../middleware/auth');
const DeckV2 = require('../models/deckv2.js');

router.get("/",ensureAuth,(req,res)=>{
    res.render("deck_viewer_home");
})

router.post("/delete/:id",ensureAuth,(req,res)=>{
    DeckV2.findOneAndDelete({$and:[{_id:req.params.id},{userID:req.user.id}]})
    .then(res.redirect("/deckviewer"))
    .catch((err)=>{
        console.log(err)
    })
});
router.get("/deck/:id",ensureAuth,(req,res)=>{
    DeckV2.findOne({$and:[{_id:req.params.id},{userID:req.user.id}]})
    .populate('cards.card').exec((err,deck)=>{
        let cardObjs=[]
        for (let card of deck.cards){
            let cardObj={id:card.card.id,imageUrl:card.card.imageUrl,instances:card.instances}
            cardObjs.push(cardObj)
        }
        let deckFormatted={_id:deck._id,deckName:deck.deckName,notes:deck.notes,format:deck.format,cards:cardObjs}
        res.render("deck_viewer_deck",{Deck:deckFormatted});
    })
})
router.get("/:format",ensureAuth,(req,res)=>{
    DeckV2.find({'$and':[{userID:req.user.id},{format:req.params.format}]})
    .then((decks)=>{
        res.render("deck_viewer_format",{Deck: decks})
    })
})

module.exports = router;