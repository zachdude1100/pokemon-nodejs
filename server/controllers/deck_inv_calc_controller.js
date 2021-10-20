const express = require('express');
const User = require("../models/User.js")
const Card = require('../models/card.js');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

module.exports.getUserDecks=(req,res,next)=>{
    User.find({_id:req.user.id},{"decks":{$elemMatch:{format:req.query.formatselection}}})
    .then((decks)=>{
        for(let i=0;i<decks.length;i++){
            let cardsQuery=[]
            let cardsArr=Object.values(decks[i].decks[0].cards)
            for(let j=0;j<cardsArr.length;j++){
                cardsQuery.push(cardsArr[j].id)
            }
            Card.find({id:{$in:cardsQuery}})
            .then((cards)=>{
                User.aggregate([{$match:{_id:req.user.id}},{$group:{"cards.id":{$in:cardsQuery}}}])
                .then((userCards)=>{
                    
                    console.log(userCards)
                })
            })
        }
        
        
    })
}