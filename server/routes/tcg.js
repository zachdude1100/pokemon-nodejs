const express = require('express');
var crypto = require("crypto");
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');
const User = require('../models/User.js')
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
const {ensureAuth,ensureGuest}=require('../middleware/auth')

const gamestateController = require('../controllers/tcg_gamestate_controller.js');


router.get("/",ensureAuth,(req,res)=>{
    res.render("tcg_lobby"); 
})
/*router.get("/decksinformat",ensureAuth,(req,res)=>{
    queryArr=Object.keys(req.query);
    Deck.find({'format':queryArr[0]})
    .exec()
    .then((foundDecks)=>{
        foundDecksObj=Object.assign({},foundDecks)
        return res.json(foundDecksObj)

    })
})
router.get("/deck/:id",ensureAuth,(req,res)=>{
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
})*/
router.get("/decksinformat",ensureAuth,(req,res)=>{
    let queryArr=Object.keys(req.query);
    User.findOne({googleId:req.user.googleId})
    .then((user)=>{
        var decksInFormat=[]
        user.decks.forEach((deck)=>{
            if (deck.format==queryArr[0]){
                decksInFormat.push(deck)
            }
        })
        let decksInFormatObj=Object.assign({},decksInFormat)
        return res.json(decksInFormatObj)
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
                var gameUUID=crypto.randomBytes(20).toString('hex');
                res.render("tcg_game_play",{Deck: user.decks[i],gameUUID:gameUUID});
                break;
            }
        }
    })
    .catch((err)=>{
        res.redirect("/deckviewer")
        console.log(err)
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