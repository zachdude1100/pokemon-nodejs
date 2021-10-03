const express = require('express');
const router = express.Router();
const crypto=require('crypto')
const gameState=require("../models/gamestates.js")
const Deck = require('../models/deck.js');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

module.exports.newGamestate = (req,res,err)=>{
    Deck.find({deckName:req.body.deckselection})
    .then(foundDeck=>{
        var UUID = crypto.randomBytes(64).toString('hex');
        const newGamestate = new gameState({
            gameStateUUID: UUID,
            gameStateName: req.body.gamename,
            playerOneUUID: "",
            playerOneName: "",
            playerOneDeck: {},
            playerOneDiscard: {},
            playerOnePrizes: {},
            playerOneHand: {},
            playerOneStage: {},

            playerTwoUUID: "",
            playerTwoName: "",
            playerTwoDeck: {},
            playerTwoDiscard: {},
            playerTwoPrizes: {},
            playerTwoHand: {},
            playerTwoStage: {},
        });
        gameState.create(newGamestate)
        
        //return res.json({Deck: foundDeck[0].cards,gameUUID:UUID})
        res.render("tcg_game_play",{Deck: foundDeck[0].cards,gameUUID:UUID,player:req.body.playerselection});
    })
    .catch((err)=>{
        console.log(err)
    })
 }

module.exports.joinGame = (req,res,next)=>{
    Deck.find({deckName:req.body.deckselection})
    .then(foundDeck=>{
        res.render("tcg_game_play",{Deck: foundDeck[0].cards,gameUUID:req.body.gameselection,player:req.body.playerselection});
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports.queryAllExisting=(req,res,next)=>{
    gameState.find()
    .then(foundGames=>{
        let foundGameStateUuidArr=[];
        foundGames.forEach(game=>{
            foundGameStateUuidArr.push({gameStateUUID:game.gameStateUUID,gameStateName:game.gameStateName})
        })
        return res.json(foundGameStateUuidArr)
    })
}
module.exports.updateGamestate =(req,res,next)=>{
    if (req.body.player=="player1")
        gameState.findOneAndUpdate({gameStateUUID:req.body.gameUUID},
            {playerOneHand:req.body.hand,playerOneDeck:req.body.deck,playerOneDiscard:req.body.discard,playerOnePrizes:req.body.prizes,playerOneUUID:"yep",playerOneStage:req.body.stageData}, 
            function(err,doc){
            if (err) return res.send(500, {error:err});
        })
    if (req.body.player=="player2")
        gameState.findOneAndUpdate({gameStateUUID:req.body.gameUUID},
            {playerTwoHand:req.body.hand,playerTwoDeck:req.body.deck,playerTwoDiscard:req.body.discard,playerTwoPrizes:req.body.prizes,playerTwoUUID:"yep",playerTwoStage:req.body.stageData}, 
            function(err,doc){
            if (err) return res.send(500, {error:err});
        })
    return res.json("success")
}

module.exports.getGameState = (req,res,next)=>{
    var gameStateUUID=Object.values(req.query)[0]
    gameState.find({gameStateUUID:gameStateUUID})
    .then(foundGame=>{
        return res.json(foundGame[0]);
    })
}
module.exports.updateCoinFlip =(req,res,next)=>{
        gameState.findOneAndUpdate({gameStateUUID:req.body.gameUUID},
            {coinFlip:req.body.flipResult}, 
            function(err,doc){
            if (err) return res.send(500, {error:err});
        })
    return res.json("success")
}
module.exports.getCoinFlip =(req,res,next)=>{
    gameState.findOne({gameStateUUID:Object.values(req.query)[0]})
    .then(flip=>{
        return res.json(flip.coinFlip)
    })
}