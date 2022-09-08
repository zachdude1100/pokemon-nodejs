const express = require('express');
const User = require("../models/User.js")
const Card = require('../models/card.js');
const fastcsv= require("fast-csv")
const fs=require("fs")

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
            Card.find({'setCode': req.params.setcode},'id imageUrl name number _id set setCode')
            .then((allCardsInSet)=>{
                res.render("inventory_set",{allCardsInSet: allCardsInSet,userCardsInSet:userCardsInSet});
                //return res.json({allCardsInSet: allCardsInSet,userCardsInSet:userCardsInSet})
            }) 
        }
    })
    .catch((err)=>{
        res.redirect("/inventory")
        console.log(err)
    })
}

module.exports.downloadCSV=(req,res,next)=>{
    User.findOne({_id:req.user.id})
    .then((user)=>{
        if(user.cards){
            let userCardsInSet=[];
            for(let i=0;i<user.cards.length;i++){
                if(user.cards[i].setCode==req.params.setcode){
                    userCardsInSet.push(user.cards[i])
                }
            }
            let cardJSON=userCardsInSet
            function writeCSV(){
                return new Promise((resolve,reject)=>{
                    const ws = fs.createWriteStream(req.params.setcode+".csv").on("finish",()=>{resolve()})
                    fastcsv.write(cardJSON,{headers:true}).on("finish",()=>{}).pipe(ws)
                })
            }
            async function doWriteCSV(){
                await writeCSV();
                res.download("./"+req.params.setcode+".csv",()=>{fs.unlinkSync("./"+req.params.setcode+".csv")})
                //res.redirect("/inventory/"+req.params.setcode)
            }
            doWriteCSV();
        }
    })
}

module.exports.updateCardInv=(req,res,next)=>{
    Card.findOne({'_id':req.body.id})
    .then((cardFromDb)=>{
        User.findOne({_id:req.user.id},{"cards":{$elemMatch:{id:cardFromDb.id}}})
        .then((card)=>{
            if(card.cards.length==0){ //card inventory doesn't exist  for this user
                addNewCard(req.user.id,cardFromDb.id,cardFromDb.name,cardFromDb.imageUrl,cardFromDb.setCode,req.body.playSetInvInput,req.body.bulkInvInput,req.body.binderCondInput)
                res.redirect('back')
            }
            else if(req.body.playSetInvInput=="0"&&req.body.bulkInvInput=="0"&&req.body.binderCondInput=="na"){ //if there are 0 cards, delete it since there's no point
                console.log("record for "+req.user.id+" "+cardFromDb.id+" has been scheduled for removal")
                deleteExistingCard(req.user.id,cardFromDb.id)
                res.redirect('back')
            }
            else if(card.cards.length!=0){ //card inventory does already exist for this user
                updateExistingCard(req.user.id,cardFromDb.id,req.body.playSetInvInput,req.body.bulkInvInput,req.body.binderCondInput)
                res.redirect('back')
            }
        })
        .catch((err)=>{
            console.log("error" +err)
        })
    })
}

function addNewCard(userId,id,name,imageUrl,setCode,playSetInv,bulkInv,binderCond){
    let cardObj={
        id:id,
        name:name,
        imageUrl:imageUrl,
        setCode:setCode,
        playSetInv:playSetInv,
        bulkInv:bulkInv,
        binderCond:binderCond
    }
    User.updateOne({"_id":userId},{$addToSet:{cards:cardObj}})
    .then(function(){return})
}
function updateExistingCard(userId,cardId,playSetInv,bulkInv,binderCond){
    User.updateOne({"_id":userId,"cards.id":cardId},{$set:{"cards.$.playSetInv":playSetInv,"cards.$.bulkInv":bulkInv,"cards.$.binderCond":binderCond}})
    .then(function(){return})
}
function deleteExistingCard(userId,cardId){
    User.findOneAndUpdate({_id:userId},{$pull:{cards:{id:cardId}}})
    .then(function(){console.log("record has been removed successfully");return})
}