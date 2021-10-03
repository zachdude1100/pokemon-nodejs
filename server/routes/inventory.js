const express = require('express');
const router = express.Router();
const Card = require('../models/card.js');
const {ensureAuth,ensureGuest}=require('../middleware/auth')

router.get("/",ensureAuth,(req,res)=>{
    res.render("inventory_home");
})

router.post("/submit",ensureAuth,(req,res)=>{
    Card.findOneAndUpdate({'_id':req.body.id},{inventory:req.body.inventoryinput}, function(err,doc){
       if (err) return res.send(500, {error:err});
    })
    .then((err)=>{
        res.redirect('back');
    })
    .catch((err)=>{
        console.log(err)
    })
});

router.get("/:setcode",ensureAuth,(req,res)=>{
    Card.find({'setCode': req.params.setcode})
    .exec()
    .then((foundCards)=>{
        res.render("inventory_set",{foundCards: foundCards});
    })
    .catch((err)=>{
        res.redirect("/inventory")
        console.log(err)
    })
})



module.exports = router;