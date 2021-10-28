const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck.js');
const DeckV2 = require('../models/deckv2.js')
const Card = require('../models/card.js');
const User = require('../models/User.js')
const crypto = require('crypto')
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

const { db } = require('../config.js');

/*router.get('/deletecardinv',(req,res)=>{
    Card.updateMany({},{$unset:{"inventory":1}})
    .then(console.log("unset inv"))
})*/

/*router.get('/importcards',(req,res)=>{
    console.log('ye')
    let arr=[
        {set:'Expedition Base Set ',setCode:'ecard1',series:'e-Card',json:'../public/Card Data/new sets 10-26/ecard1.json'},
{set:'Aquapolis ',setCode:'ecard2',series:'e-Card',json:'../public/Card Data/new sets 10-26/ecard2.json'},
{set:'Skyridge ',setCode:'ecard3',series:'e-Card',json:'../public/Card Data/new sets 10-26/ecard3.json'},
{set:'EX Deoxys ',setCode:'ex8',series:'EX',json:'../public/Card Data/new sets 10-26/ex8.json'},
{set:'EX Delta Species ',setCode:'ex11',series:'EX',json:'../public/Card Data/new sets 10-26/ex11.json'},
{set:'HeartGold & SoulSilver ',setCode:'hgss1',series:'HeartGold & SoulSilver',json:'../public/Card Data/new sets 10-26/hgss1.json'},
{set:'Evolving Skies ',setCode:'swsh7',series:'Sword & Shield',json:'../public/Card Data/new sets 10-26/swsh7.json'},
{set:'DP Black Star Promos',setCode:'dpp',series:'Diamond & Pearl',json:'../public/Card Data/new sets 10-26/dpp.json'},
{set:'HGSS Black Star Promos',setCode:'hsp',series:'HeartGold & SoulSilver',json:'../public/Card Data/new sets 10-26/hsp.json'},
    ]
    let setRes=[]
    for (let set of arr){
        
        let json=require(set.json);
        Card.count({setCode:set.setCode},function(err,count){
            //if(count!=json.length)
            console.log(count+" in db of "+set.set+", "+json.length+" in the json")
        })
        for (let card of json){
            let subtype=""
            if(card.subtype){
                subtype=card.subtype
            }
            

            Card.create({
                duplicateprints:[],
                id:card.id,
                name:card.name,
                imageUrl:card.images.small,
                subtype:subtype,
                supertype:card.supertype,
                number:card.number,
                rarity:card.rarity,
                series:set.series,
                set:set.set,
                setCode:set.setCode,
                imageUrlHiRes:card.images.large,
                artist:card.artist

            })
        }
        
        
    }
        
    
})*/



/*router.get('/deleteset',(req,res)=>{
    Card.deleteMany({setCode:{$in:["ecard1","ecard2","ecard3","ex8","ex11","hgss1","swsh7","dpp","hsp"]}})
    .then(console.log("yoot"))
})*/



module.exports=router;