const express = require('express');
var crypto = require("crypto");
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');
const User = require('../models/User.js')
const DeckV2 = require('../models/deckv2.js');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const gamestateController = require('../controllers/tcg_gamestate_controller.js');
router.get("/",ensureAuth,(req,res)=>{
    res.render("tcg_lobby"); 
})   
router.get("/decksinformat",ensureAuth,(req,res)=>{
    DeckV2.find({$and:[{userID:req.user.id},{format:req.query.format}]})
    .then((decks)=>{
        return res.json(decks)
    })
})
router.get("/deck/:id",ensureAuth,(req,res)=>{
    DeckV2.findOne({$and:[{_id:req.params.id},{userID:req.user.id}]})
    .populate('cards.card').exec((err,deck)=>{
        let cardObjs=[]
        for (let card of deck.cards){
            let cardObj={id:card.card.id,imageUrl:card.card.imageUrl,instances:card.instances}
            cardObjs.push(cardObj)
        }
        var gameUUID=crypto.randomBytes(20).toString('hex');
        let deckFormatted={_id:deck._id,deckName:deck.deckName,notes:deck.notes,format:deck.format,cards:cardObjs}
        res.render("tcg_game_play",{Deck:deckFormatted,gameUUID:gameUUID});
    })
})
router.get("/queryexistinggamestates",ensureAuth,gamestateController.queryAllExisting)
router.get("/getgamestate",ensureAuth,gamestateController.getGameState)
router.get("/coinflip",ensureAuth,gamestateController.getCoinFlip)
router.post("/newgame",ensureAuth,gamestateController.newGamestate)
router.post("/joingame",ensureAuth,gamestateController.joinGame)
router.post("/updategamestate",ensureAuth,gamestateController.updateGamestate)
router.post("/coinflip",ensureAuth,gamestateController.updateCoinFlip)


module.exports = router;