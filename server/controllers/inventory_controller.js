const express = require('express');
const User = require("../models/User.js")
const Card = require('../models/card.js');

module.exports.returnUserCardsInFormat=(req,res,next)=>{
    User.findOne({_id:req.user.id})
    .then((user)=>{
        if(user.cards){
            let userCardsInSet=[];
            for(let i=0;i<user.cards.length;i++){
                if(user.cards[i].setCode==req.params.setcode){
                    userCardsInSet.push(user.cards[i])
                }
            }
            Card.find({'setCode': req.params.setcode})
            .then((allCardsInSet)=>{
                res.render("inventory_set",{allCardsInSet: allCardsInSet,userCardsInSet:userCardsInSet});
            }) 
        }
    })
    .catch((err)=>{
        res.redirect("/inventory")
        console.log(err)
    })
}

module.exports.updateCardInv=(req,res,next)=>{
    Card.findOne({'_id':req.body.id})
    .then((cardFromDb)=>{
        User.findOne({_id:req.user.id},{"cards":{$elemMatch:{id:cardFromDb.id}}})
        .then((card)=>{
            if(card.cards.length==0){ //card doesn't exist yet
                addNewCard(req.user.id,cardFromDb.id,cardFromDb.name,cardFromDb.imageUrl,cardFromDb.setCode,req.body.playSetInvInput)
                res.redirect('back')
            }
            else if(req.body.playSetInvInput=="0"){ //if there are 0 cards, delete it since there's no point
                console.log("yee")
                deleteExistingCard(req.user.id,cardFromDb.id)
                res.redirect('back')
            }
            else if(card.cards.length!=0){ //card does already exist
                updateExistingCard(req.user.id,cardFromDb.id,req.body.playSetInvInput)
                res.redirect('back')
            }
        })
        .catch((err)=>{
            console.log("error" +err)
        })
    })
}

function addNewCard(userId,id,name,imageUrl,setCode,playSetInv){
    let cardObj={
        id:id,
        name:name,
        imageUrl:imageUrl,
        setCode:setCode,
        playSetInv:playSetInv,
        bulkInv:"0",
        binderCond:"na"
    }
    User.updateOne({"_id":userId},{$addToSet:{cards:cardObj}})
    .then(function(){return})
}
function updateExistingCard(userId,cardId,playSetInv){
    User.updateOne({"_id":userId,"cards.id":cardId},{$set:{"cards.$.playSetInv":playSetInv}})
    .then(function(){return})
}
function deleteExistingCard(userId,cardId){
    User.findOneAndUpdate({_id:userId},{$pull:{cards:{id:cardId}}})
    .then(function(){console.log("ye");return})
}