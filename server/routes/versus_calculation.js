const express = require('express');
const router = express.Router();
const Deck = require('../models/deck.js');
const Card = require('../models/card.js');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

router.get("/",(req,res)=>{
    res.render("versus_calculation_home");
})

router.get("/decksinformat",(req,res)=>{
    queryArr=Object.keys(req.query);
    Deck.find({'format':queryArr[0]})
    .exec()
    .then((foundDecks)=>{
        foundDecksObj=Object.assign({},foundDecks)
        return res.json(foundDecksObj)

    })
})

router.get("/getdecks",(req,res)=>{
    queryArr=Object.values(req.query);

    let arr=[];
    queryArr.forEach(element =>{
        arr.push(element.id)
    });
    Deck.find({deckName:{$in:queryArr}})
    .exec()
    .then((foundDecks)=>{
        foundDecksObj=Object.assign({},foundDecks)
        return res.json(foundDecks)
    })
})
router.get("/submit",(req,res)=>{    
    queryArr=Object.values(req.query)
    let arr=[]; // This was a bitch. Takes ye olde deck json and searches for duplicate printings with mostly successful parameters
    queryArr.forEach(element => {
        arr.push(element.id)
    });
    Card.find({id: {$in:arr}})
    .exec()
    .then((foundCards)=>{
        let arr2=[];
        for(let i=0; i<foundCards.length;i++){      //build the fkn query
            //arr2[i]={$and:[{name:foundCards[i].name,artist:foundCards[i].artist,series:foundCards[i].series}]}
            foundCards[i].duplicateprints.push(foundCards[i].id)
            arr2[i]={id:{$in:foundCards[i].duplicateprints}}
        }
        /*let testarr=[           //jesus christ, this is the data format that works thank god
            {$and:[{name: "Charizard"},{series: "Base"}]},
            {$and:[{name: "Item Finder"},{series: "Base"}]}
        ];   */
        Card.find({$or:arr2}) //fuck this shit, too hard lel
        .then((foundCards) =>{
            foundCardsObj=Object.assign({}, foundCards);
            return res.json(foundCards)
        })
    })
})



module.exports = router;