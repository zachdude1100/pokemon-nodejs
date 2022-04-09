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
const _ = require('lodash')
router.use(bodyParser.urlencoded({extended: true}));

const { db } = require('../config.js');

/*router.get('/deletecardinv',(req,res)=>{
    Card.updateMany({},{$unset:{"inventory":1}})
    .then(console.log("unset inv"))
})*/

/*router.get('/importcards',(req,res)=>{
    console.log('ye')
    let arr=[
        {set:"X & Y Promos",setCode:'xyp',series:'X & Y',json:'../public/Card Data/new sets 10-26/xyp.json'}]
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
    Card.deleteMany({setCode:{$in:["bwp"]}})
    .then(console.log("yoot"))
})*/
/*legalsets=[
{base1:['Base_Set','Base_Jungle','Base_Fossil','Base_Team_Rocket','Base_Gym','Prop_153','Base_Neo']},
{base2:['Base_Jungle','Base_Fossil','Base_Team_Rocket','Base_Gym','Prop_153','Base_Neo']},
{base3:['Base_Fossil','Base_Team_Rocket','Base_Gym','Prop_153','Base_Neo']},
{base4:['Base_Fossil','Base_Team_Rocket','Base_Gym','Prop_153','Base_Neo']},
{base5:['Base_Team_Rocket','Base_Gym','Prop_153','Base_Neo','Rocket_On']},
{gym1:['Base_Gym','Prop_153','Base_Neo','Rocket_On']},
{gym2:['Base_Gym','Prop_153','Base_Neo','Rocket_On']},
{neo1:['Base_Neo','Rocket_On','Neo_On']},
{neo2:['Base_Neo','Rocket_On','Neo_On']},
{neo3:['Base_Neo','Rocket_On','Neo_On']},
{neo4:['Base_Neo','Rocket_On','Neo_On']},
{si1:['Base_Neo','Rocket_On','Neo_On']},
{base6:['Rocket_On','Neo_On']},
{ecard1:['Neo_On','0304mod']},
{ecard2:['Neo_On','0304mod']},
{ecard3:['Neo_On','0304mod']},
{ex1:['0304mod','0405mod']},
{ex2:['0304mod','0405mod']},
{ex3:['0304mod','0405mod']},
{ex4:['0304mod','0405mod']},
{ex5:['0304mod','0405mod']},
{ex6:['0405mod','0506mod']},
{ex7:['0405mod','0506mod']},
{ex8:['0405mod','0506mod','0607mod']},
{ex9:['0405mod','0506mod','0607mod']},
{ex10:['0506mod','0607mod']},
{ex11:['0506mod','0607mod']},
{ex12:['0507mod','0608mod']},
{ex13:['0506mod','0607mod','0708mod']},
{ex14:['0607mod','0708mod']},
{ex15:['0607mod','0708mod']},
{ex16:['0607mod','0708mod']},
{pop1:['0405mod','0506mod']},
{pop2:['0506mod','0607mod']},
{pop3:['0506mod','0607mod']},
{pop4:['0607mod','0708mod']},
{pop5:['0607mod','0708mod']},
{pop6:['0708mod','0810mod']},
{pop7:['0708mod','0810mod']},
{pop8:['0810mod']},
{pop9:['0810mod']},
{dp1:['0708mod','0810mod']},
{dp2:['0708mod','0810mod']},
{dp3:['0708mod','0810mod']},
{dp4:['0708mod','0810mod']},
{dp5:['0708mod','0810mod','1011mod']},
{dp6:['0810mod','1011mod']},
{dp7:['0810mod','1011mod']},
{pl1:['0810mod','1011mod']},
{pl2:['0810mod','1011mod']},
{pl3:['0810mod','1011mod']},
{pl4:['0810mod','1011mod']},
{ru1:['0810mod','1011mod']},
{hgss1:['0810mod','1011mod','1112mod']},
{hgss2:['0810mod','1011mod','1112mod']},
{hgss3:['1011mod','1112mod']},
{hgss4:['1011mod','1112mod']},
{col1:['1011mod','1112mod']},
{bw1:['1011mod','1112mod','1213mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw2:['1112mod','1213mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw3:['1112mod','1213mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw4:['1112mod','1213mod','1314mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw5:['1112mod','1213mod','1314mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw6:['1213mod','1314mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw7:['1213mod','1314mod','1415standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw8:['1213mod','1314mod','1415standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw9:['1213mod','1314mod','1415standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw10:['1314mod','1415standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{bw11:['1314mod','1415standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd11:['1112mod','1213mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd12:['1112mod','1213mod','1314mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd14:['1314mod','1415standard','1516standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd15:['1516standard','1617standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd16:['1617standard','1718standard','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd17:['1718standard','1819standard','1718exp','1819exp','1920exp','2021exp','2122exp']},
{mcd18:['1819standard','1819exp','1920exp','2021exp','2122exp']},
{dv1:['1213mod','1314mod','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy0:['1314mod','1415standard','1516standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy1:['1314mod','1415standard','1516standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy2:['1314mod','1415standard','1516standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy3:['1415standard','1516standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy4:['1415standard','1516standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy5:['1415standard','1516standard','1617standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy6:['1415standard','1516standard','1617standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy7:['1516standard','1617standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy8:['1516standard','1617standard','1718standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy9:['1516standard','1617standard','1718standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy10:['1516standard','1617standard','1718standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy11:['1516standard','1617standard','1718standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{xy12:['1617standard','1718standard','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{dc1:['1415standard','1516standard','1617standard','1415exp','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{g1:['1516standard','1617standard','1718standard','1516exp','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm1:['1617standard','1718standard','1819standard','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm2:['1617standard','1718standard','1819standard','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm3:['1617standard','1718standard','1819standard','1617exp','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm4:['1718standard','1819standard','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm5:['1718standard','1819standard','1920standard','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm6:['1718standard','1819standard','1920standard','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm7:['1718standard','1819standard','1920standard','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm8:['1819standard','1920standard','1819exp','1920exp','2021exp','2122exp']},
{sm9:['1819standard','1920standard','2021standard','1819exp','1920exp','2021exp','2122exp']},
{sm10:['1819standard','1920standard','2021standard','1819exp','1920exp','2021exp','2122exp']},
{sm11:['1920standard','2021standard','1920exp','2021exp','2122exp']},
{sm12:['1920standard','2021standard','1920exp','2021exp','2122exp']},
{sm35:['1718standard','1819standard','1718exp','1819exp','1920exp','2021exp','2122exp']},
{sm75:['1819standard','1920standard','1819exp','1920exp','2021exp','2122exp']},
{sm115:['1920standard','2021standard','1920exp','2021exp','2122exp']},
{det1:['1819standard','1920standard','2021standard','1819exp','1920exp','2021exp','2122exp']},
{swsh1:['1920standard','2021standard','2122standard','1920exp','2021exp','2122exp']},
{swsh2:['1920standard','2021standard','2122standard','1920exp','2021exp','2122exp']},
{swsh3:['1920standard','2021standard','2122standard','1920exp','2021exp','2122exp']},
{swsh4:['2021standard','2122standard','2021exp','2122exp']},
{swsh5:['2021standard','2122standard','2021exp','2122exp']},
{swsh6:['2021standard','2122standard','2021exp','2122exp']},
{swsh7:['2122standard','2122exp']},
{sma:['1920standard','2021standard','1920exp','2021exp','2122exp']},
{swsh35:['2021standard','2122standard','2021exp','2122exp']},
{swsh45:['2021standard','2122standard','2021exp','2122exp']},
{swsh45sv:['2021standard','2122standard','2021exp','2122exp']}];*/


/*router.get('/initlegalformat',(req,res)=>{
    Card.updateMany({},{legalFormats:[]})
    .then(res=>{
        console.log("done")
    })
})*/

legalpromos=[['basep',1,5,'Base_Set'],
['basep',1,5,'Base_Jungle'],
['basep',1,15,'Base_Fossil'],
['basep',1,18,'Base_Rocket'],
['basep',1,24,'Base_Gym'],
['basep',29,29,'Base_Gym'],
['basep',1,24,'Prop_153'],
['basep',29,29,'Prop_153'],
['basep',1,46,'Base_Neo'],
['basep',1,48,'Rocket_On'],
['basep',21,53,'Neo_On'],
['np',1,26,'0304mod'],
['np',1,27,'0405mod'],
['np',27,33,'0506mod'],
['np',35,36,'0506mod'],
['np',29,40,'0607mod'],
['dpp',1,56,'0607mod'],
['np',37,40,'0708mod'],
['dpp',1,56,'0708mod'],
['dpp',1,56,'0810mod'],
['dpp',22,56,'1011mod'],
['hsp',1,25,'1011mod'],
['hsp',1,25,'1112mod'],
['bwp',1,101,'1112mod'],
['bwp',1,101,'1213mod'],
['bwp',33,101,'1314mod'],
['xyp',1,216,'1314mod'],
['bwp',51,76,'1415standard'],
['bwp',79,101,'1415standard'],
['xyp',1,55,'1415standard'],
['xyp',91,91,'1415standard'],
['xyp',1,116,'1516standard'],
['xyp',121,123,'1516standard'],
['xyp',127,156,'1516standard'],
['xyp',176,176,'1516standard'],
['xyp',36,211,'1617standard'],
['smp',1,44,'1617standard'],
['smp',46,51,'1617standard'],
['smp',78,78,'1617standard'],
['xyp',67,216,'1718standard'],
['smp',1,102,'1718standard'],
['smp',105,124,'1718standard'],
['smp',127,134,'1718standard'],
['smp',148,148,'1718standard'],
['smp',1,190,'1819standard'],
['smp',194,201,'1819standard'],
['smp',208,209,'1819standard'],
['smp',94,244,'1920standard'],
['swshp',1,32,'1920standard'],
['smp',158,247,'2021standard'],
['swshp',1,130,'2021standard'],
['swshp',1,130,'2122standard'],
['bwp',1,101,'1415exp'],
['xyp',1,216,'1415exp'],
['bwp',1,101,'1516exp'],
['xyp',1,216,'1516exp'],
['bwp',1,101,'1617exp'],
['xyp',1,216,'1617exp'],
['bwp',1,101,'1718exp'],
['xyp',1,216,'1718exp'],
['smp',1,247,'1718exp'],
['bwp',1,101,'1819exp'],
['xyp',1,216,'1819exp'],
['smp',1,247,'1819exp'],
['bwp',1,101,'1819exp'],
['xyp',1,216,'1920exp'],
['smp',1,247,'1920exp'],
['swshp',1,130,'1920exp'],
['xyp',1,216,'2021exp'],
['smp',1,247,'2021exp'],
['swshp',1,130,'2021exp'],
['xyp',1,216,'2122exp'],
['smp',1,247,'2122exp'],
['swshp',1,130,'2122exp']
]
/*router.get('/addlegalformats',(req,res)=>{
    for (let i=0;i<legalsets.length;i++){
        let setcode=Object.keys(legalsets[i])[0]
        let legalformatarr=Object.values(legalsets[i])[0]
        Card.updateMany({setCode:setcode},{legalFormats:legalformatarr})
        .then(res=>{
            console.log("did it boss")
        })
    }
    
})
router.get('/addlegalpromos',(req,res)=>{
    for (let i=0;i<legalpromos.length;i++){
        let setcode=legalpromos[i][0];
        let min=legalpromos[i][1];
        let max=legalpromos[i][2];
        let format=legalpromos[i][3];
        let cur=0;

        if(setcode=="basep"){
            for(let k=min;k<=max;k++){
                cur=k;
                //console.log(String(cur)+" "+format)

                Card.updateOne({$and:[{setCode:"basep"},{number:String(cur)}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }
        if(setcode=="np"){
            for(let k=min;k<=max;k++){
                cur=k;
                Card.updateOne({$and:[{setCode:"np"},{number:String(cur)}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }
        if(setcode=="dpp"){
            for(let k=min;k<=max;k++){
                if(k<10){
                    cur="DP0"+k;
                }
                if(k>9){
                    cur="DP"+k;
                }
                Card.updateOne({$and:[{setCode:"dpp"},{number:cur}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }
        if(setcode=="bwp"){
            for(let k=min;k<=max;k++){
                if(k<10){
                    cur="BW0"+k;
                }
                if(k>9){
                    cur="BW"+k;
                }
                Card.updateOne({$and:[{setCode:"bwp"},{number:cur}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }
        if(setcode=="xyp"){
            for(let k=min;k<=max;k++){
                if(k<10){
                    cur="XY0"+k;
                }
                if(k>9){
                    cur="XY"+k;
                }
                Card.updateOne({$and:[{setCode:"bwp"},{number:cur}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }
        if(setcode=="smp"){
            for(let k=min;k<=max;k++){
                if(k<10){
                    cur="SM0"+k;
                }
                if(k>9){
                    cur="SM"+k;
                }
                Card.updateOne({$and:[{setCode:"smp"},{number:cur}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }
        if(setcode=="swshp"){
            for(let k=min;k<=max;k++){
                if(k<10){
                    cur="SWSH00"+k;
                }
                if(k>9&&k<100){
                    cur="SWSH0"+k;
                }
                if(k>99){
                    cur="SWSH"+k
                }
                Card.updateOne({$and:[{setCode:"swshp"},{number:cur}]},{$addToSet:{legalFormats:format}})
                .then(function(){return})
            }
        }

        
    }
})*/
router.get('/calculatedupes',(req,res)=>{
    Card.find({supertype:"Pokémon"})
    .then((cardsfound)=>{
        let cardsArr=[]
        let finalGroupsArr=[]
        cardsfound.forEach((card)=>{
            cardsArr.push({id:card.id,resistances:card.resistances,abilities:card.abilities,weaknesses:card.weaknesses,convertedRetreatCost:card.convertedRetreatCost,hp:card.hp,name:card.name,artist:card.artist,imageUrl:card.imageUrl,attacks:card.attacks,flavorText:card.flavorText})
        })
        /*let groups = cardsArr.reduce((groups, item)=>{
            const group = (groups[item.attacks]||[]);
                group.push(item);
                groups[item.attacks]=group;
                return groups;
        },{});
        let groupsArr=Object.values(groups)
        for(let grouping of groupsArr){
            if(grouping.length==1){}
            else{
                finalGroupsArr.push(grouping)
            }
        }*/
        let groupedArr=[]
        let isEqual=false;
        let isEqual1=false;
        let isEqual2=false;
        let isEqual3=false;
        for (let i=0;i<cardsArr.length;i++){
            if(groupedArr.length==0){
                groupedArr.push([cardsArr[i]])
            }
            for(let k=0;k<groupedArr.length;k++){
                isEqual=false
                isEqual1=false
                isEqual2=false;
                isEqual3=true; //bootleg hack to make the last conditional work even though some cards don't have it
                if(cardsArr[i].name&&groupedArr[k][0].name&&cardsArr[i].attacks&&groupedArr[k][0].attacks){ //makes sure it actually has these properties
                    if(cardsArr[i].name==groupedArr[k][0].name){
                        if(cardsArr[i].hp==groupedArr[k][0].hp){
                            if(cardsArr[i].attacks[0].name==groupedArr[k][0].attacks[0].name&&cardsArr[i].attacks[0].damage==groupedArr[k][0].attacks[0].damage){
                                if(cardsArr[i].attacks.length==groupedArr[k][0].attacks.length){
                                    let index=cardsArr[i].attacks.length-1;
                                    if(cardsArr[i].attacks[index].name==groupedArr[k][0].attacks[index].name&&cardsArr[i].attacks[index].damage==groupedArr[k][0].attacks[index].damage)
                                        if(cardsArr[i].convertedRetreatCost==groupedArr[k][0].convertedRetreatCost){
                                            isEqual1=_.isEqual(cardsArr[i].weaknesses,groupedArr[k][0].weaknesses)
                                            isEqual2=_.isEqual(cardsArr[i].resistances,groupedArr[k][0].resistances)
                                            if(cardsArr[i].abilities!=null&&groupedArr[k][0].abilities!=null)
                                                isEqual3=false
                                                console.log(cardsArr[i].id)
                                                isEqual3=_.isEqual(cardsArr[i].abilities[0].name,groupedArr[k][0].abilities[0].name)
                                        }
                                }
                            }
                        }
                    }
                }
                
                if(isEqual1==true&&isEqual2==true&&isEqual3==true){
                    isEqual==true;
                }
                if(isEqual==true){
                    groupedArr[k].push(cardsArr[i])
                    //console.log(cardsArr[i].name+" is equal to "+groupedArr[k][0].name)
                    break;
                }
                
            }
            if(isEqual==false){
                groupedArr.push([cardsArr[i]])
                //console.log(cardsArr[i].name+" is not a reprint so far")
            }
        }
        //console.log(groupedArr)
        let reducedArr=[]
        let imgArr=[]
        groupedArr.forEach((group)=>{
            if(group.length>1){
                reducedArr.push(group)
                let imgGroup=[]
                group.forEach((card)=>{
                    imgGroup.push({name:card.name,imageUrl:card.imageUrl})
                })
                imgArr.push(imgGroup)
            }
        })

        return res.json(reducedArr)
        //res.render('reprint',{finalGroupsArr:imgArr})
    })
})
/*
router.get('/updatecardswithmoreinfo',(req,res)=>{
    let jsonArr=[
        '../public/Card Data/new sets 10-26/base1.json',
'../public/Card Data/new sets 10-26/base2.json',
'../public/Card Data/new sets 10-26/base3.json',
'../public/Card Data/new sets 10-26/base4.json',
'../public/Card Data/new sets 10-26/base5.json',
'../public/Card Data/new sets 10-26/base6.json',
'../public/Card Data/new sets 10-26/basep.json',
'../public/Card Data/new sets 10-26/bp.json',
'../public/Card Data/new sets 10-26/bw10.json',
'../public/Card Data/new sets 10-26/bw11.json',
'../public/Card Data/new sets 10-26/bw1.json',
'../public/Card Data/new sets 10-26/bw2.json',
'../public/Card Data/new sets 10-26/bw3.json',
'../public/Card Data/new sets 10-26/bw4.json',
'../public/Card Data/new sets 10-26/bw5.json',
'../public/Card Data/new sets 10-26/bw6.json',
'../public/Card Data/new sets 10-26/bw7.json',
'../public/Card Data/new sets 10-26/bw8.json',
'../public/Card Data/new sets 10-26/bw9.json',
'../public/Card Data/new sets 10-26/bwp.json',
'../public/Card Data/new sets 10-26/cel25c.json',
'../public/Card Data/new sets 10-26/cel25.json',
'../public/Card Data/new sets 10-26/col1.json',
'../public/Card Data/new sets 10-26/dc1.json',
'../public/Card Data/new sets 10-26/det1.json',
'../public/Card Data/new sets 10-26/dp1.json',
'../public/Card Data/new sets 10-26/dp2.json',
'../public/Card Data/new sets 10-26/dp3.json',
'../public/Card Data/new sets 10-26/dp4.json',
'../public/Card Data/new sets 10-26/dp5.json',
'../public/Card Data/new sets 10-26/dp6.json',
'../public/Card Data/new sets 10-26/dp7.json',
'../public/Card Data/new sets 10-26/dpp.json',
'../public/Card Data/new sets 10-26/dv1.json',
'../public/Card Data/new sets 10-26/ecard1.json',
'../public/Card Data/new sets 10-26/ecard2.json',
'../public/Card Data/new sets 10-26/ecard3.json',
'../public/Card Data/new sets 10-26/ex10.json',
'../public/Card Data/new sets 10-26/ex11.json',
'../public/Card Data/new sets 10-26/ex12.json',
'../public/Card Data/new sets 10-26/ex13.json',
'../public/Card Data/new sets 10-26/ex14.json',
'../public/Card Data/new sets 10-26/ex15.json',
'../public/Card Data/new sets 10-26/ex16.json',
'../public/Card Data/new sets 10-26/ex1.json',
'../public/Card Data/new sets 10-26/ex2.json',
'../public/Card Data/new sets 10-26/ex3.json',
'../public/Card Data/new sets 10-26/ex4.json',
'../public/Card Data/new sets 10-26/ex5.json',
'../public/Card Data/new sets 10-26/ex6.json',
'../public/Card Data/new sets 10-26/ex7.json',
'../public/Card Data/new sets 10-26/ex8.json',
'../public/Card Data/new sets 10-26/ex9.json',
'../public/Card Data/new sets 10-26/fut20.json',
'../public/Card Data/new sets 10-26/g1.json',
'../public/Card Data/new sets 10-26/gym1.json',
'../public/Card Data/new sets 10-26/gym2.json',
'../public/Card Data/new sets 10-26/hgss1.json',
'../public/Card Data/new sets 10-26/hgss2.json',
'../public/Card Data/new sets 10-26/hgss3.json',
'../public/Card Data/new sets 10-26/hgss4.json',
'../public/Card Data/new sets 10-26/hsp.json',
'../public/Card Data/new sets 10-26/mcd11.json',
'../public/Card Data/new sets 10-26/mcd12.json',
'../public/Card Data/new sets 10-26/mcd14.json',
'../public/Card Data/new sets 10-26/mcd15.json',
'../public/Card Data/new sets 10-26/mcd16.json',
'../public/Card Data/new sets 10-26/mcd17.json',
'../public/Card Data/new sets 10-26/mcd18.json',
'../public/Card Data/new sets 10-26/mcd19.json',
'../public/Card Data/new sets 10-26/mcd21.json',
'../public/Card Data/new sets 10-26/neo1.json',
'../public/Card Data/new sets 10-26/neo2.json',
'../public/Card Data/new sets 10-26/neo3.json',
'../public/Card Data/new sets 10-26/neo4.json',
'../public/Card Data/new sets 10-26/np.json',
'../public/Card Data/new sets 10-26/pl1.json',
'../public/Card Data/new sets 10-26/pl2.json',
'../public/Card Data/new sets 10-26/pl3.json',
'../public/Card Data/new sets 10-26/pl4.json',
'../public/Card Data/new sets 10-26/pop1.json',
'../public/Card Data/new sets 10-26/pop2.json',
'../public/Card Data/new sets 10-26/pop3.json',
'../public/Card Data/new sets 10-26/pop4.json',
'../public/Card Data/new sets 10-26/pop5.json',
'../public/Card Data/new sets 10-26/pop6.json',
'../public/Card Data/new sets 10-26/pop7.json',
'../public/Card Data/new sets 10-26/pop8.json',
'../public/Card Data/new sets 10-26/pop9.json',
'../public/Card Data/new sets 10-26/ru1.json',
'../public/Card Data/new sets 10-26/si1.json',
'../public/Card Data/new sets 10-26/sm10.json',
'../public/Card Data/new sets 10-26/sm115.json',
'../public/Card Data/new sets 10-26/sm11.json',
'../public/Card Data/new sets 10-26/sm12.json',
'../public/Card Data/new sets 10-26/sm1.json',
'../public/Card Data/new sets 10-26/sm2.json',
'../public/Card Data/new sets 10-26/sm35.json',
'../public/Card Data/new sets 10-26/sm3.json',
'../public/Card Data/new sets 10-26/sm4.json',
'../public/Card Data/new sets 10-26/sm5.json',
'../public/Card Data/new sets 10-26/sm6.json',
'../public/Card Data/new sets 10-26/sm75.json',
'../public/Card Data/new sets 10-26/sm7.json',
'../public/Card Data/new sets 10-26/sm8.json',
'../public/Card Data/new sets 10-26/sm9.json',
'../public/Card Data/new sets 10-26/sma.json',
'../public/Card Data/new sets 10-26/smp.json',
'../public/Card Data/new sets 10-26/swsh1.json',
'../public/Card Data/new sets 10-26/swsh2.json',
'../public/Card Data/new sets 10-26/swsh35.json',
'../public/Card Data/new sets 10-26/swsh3.json',
'../public/Card Data/new sets 10-26/swsh45.json',
'../public/Card Data/new sets 10-26/swsh45sv.json',
'../public/Card Data/new sets 10-26/swsh4.json',
'../public/Card Data/new sets 10-26/swsh5.json',
'../public/Card Data/new sets 10-26/swsh6.json',
'../public/Card Data/new sets 10-26/swsh7.json',
'../public/Card Data/new sets 10-26/swsh8.json',
'../public/Card Data/new sets 10-26/swshp.json',
'../public/Card Data/new sets 10-26/xy0.json',
'../public/Card Data/new sets 10-26/xy10.json',
'../public/Card Data/new sets 10-26/xy11.json',
'../public/Card Data/new sets 10-26/xy12.json',
'../public/Card Data/new sets 10-26/xy1.json',
'../public/Card Data/new sets 10-26/xy2.json',
'../public/Card Data/new sets 10-26/xy3.json',
'../public/Card Data/new sets 10-26/xy4.json',
'../public/Card Data/new sets 10-26/xy5.json',
'../public/Card Data/new sets 10-26/xy6.json',
'../public/Card Data/new sets 10-26/xy7.json',
'../public/Card Data/new sets 10-26/xy8.json',
'../public/Card Data/new sets 10-26/xy9.json',
'../public/Card Data/new sets 10-26/xyp.json',

    ]
    for(json of jsonArr){
        console.log("next json loaded")
    let jsonReq=require(json)
    for(card of jsonReq){       
        
        if(card.supertype=="Pokémon"){
            Card.findOneAndUpdate({id:card.id},{hp:card.hp,types:card.types,evolvesTo:card.evolvesTo,attacks:card.attacks,weaknesses:card.weaknesses,resistances:card.resistances,retreatCost:card.retreatCost,convertedRetreatCost:card.convertedRetreatCost,flavorText:card.flavorText,abilities:card.abilities})
            .then((res)=>{//console.log("updated successfully "+res.id)
            })
            .catch((err)=>{console.log("error was detected "+err)})
        }
        if(card.supertype=="Trainer"){
            if(card.rules){
                Card.findOneAndUpdate({id:card.id},{rules:card.rules})
                .then((res)=>{//console.log("updated successfully "+res.id)
                    
            })
            .catch((err)=>{console.log("error was detected "+err)})
            }
            if(card.text){
                Card.findOneAndUpdate({id:card.id},{rules:card.text})
                .then((res)=>{//console.log("updated successfully "+res.id)
            })
            .catch((err)=>{console.log("error was detected "+err)})
            }
        }
        if(card.supertype=="Energy"){
            if(card.rules){
                Card.findOneAndUpdate({id:card.id},{rules:card.rules})
                .then((res)=>{//console.log("updated successfully "+res.id)
            })
            .catch((err)=>{console.log("error was detected "+err)})
            }
            if(card.text){
                Card.findOneAndUpdate({id:card.id},{rules:card.text})
                .then((res)=>{//console.log("updated successfully "+res.id)
            })
            .catch((err)=>{console.log("error was detected "+err)})
            }
        }
    }
}
})
*/

module.exports=router;