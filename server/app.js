const express=require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.js');
const mongoose = require('mongoose');
const gameState=require("./models/gamestates.js")
const cors = require('cors');
const socket = require('socket.io')
const morgan = require('morgan');
const passport=require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const dotenv = require('dotenv')
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

const deckBuilder = require('./routes/deckbuilder.js');
const deckViewer= require('./routes/deckviewer.js');
const inventory = require('./routes/inventory.js');
const deckCalculation = require('./routes/deck_calculation.js')
const adminUtility = require('./routes/administrator_utility.js')
const home = require('./routes/home.js');
const tcg = require('./routes/tcg.js')
const auth = require('./routes/auth.js')
const { isArray, isNullOrUndefined } = require('util');

// Load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

// sessions
app.use(session({
    secret: 'asfg98puyxpcnwah77iu2',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({mongoUrl:process.env.MONGO_URI})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use('/deckcalculation',deckCalculation)
app.use('/deckbuilder',deckBuilder)
app.use('/deckviewer',deckViewer)
app.use('/inventory',inventory)
app.use('/adminutility',adminUtility)
app.use('/',home)
app.use('/tcg',tcg)
app.use('/auth',auth)


mongoose.connect(config.db.connection, config.options, {useNewUrlParser: true, useUnifiedTopology: true});

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

var server = app.listen(80,() => {
    console.log("application is running")
});

var io = socket(server);
const socketUsers={}
io.sockets.on('connection',function(socket){
    let minGameAge=Date.now()-3600000; //current epoch time-60minutes
    gameState.deleteMany({activeTime:{$lt:minGameAge}}) //deletes all game states that haven't been updated in 60 minutes
    .then((res)=>{return})
    socket.on('updateGameState',stageData=>{
        socket.broadcast.emit('updateGameState',stageData)
    })
    socket.on('updateCoinFlip',stageData=>{
        socket.broadcast.emit('updateCoinFlip',stageData)
    })
    socket.on('new-user',name=>{
        socketUsers[socket.id]=name;
        socket.broadcast.emit('user-connected',name)
        
    })
    socket.on('send-chat-message',message=>{
        socket.broadcast.emit('chat-message',{message,name:socketUsers[socket.id]})
    })
    socket.on('disconnect',()=>{
        if(socketUsers[socket.id]){
            socket.broadcast.emit('user-disconnected',socketUsers[socket.id])
            delete socketUsers[socket.id]
        }
        
    })
})

















































/*
app.post("/updatecardstonewschema",(req,res)=>{
    Card.collection.update({duplicateprints:{$exists: true}},{$set:{duplicateprints: []}},{multi:true})
    //updatecards();
})

app.post("/duplicatecardsupdate",(req,res)=>{
    cardArray=duplicateCardsUpdate();
    
});

app.post("/deletecardsfromjson",(req,res)=>{
    let cards=require('./public/Card Data/Legendary Collection.json');
    cards.forEach(e => {
        let id = e.id;
        console.log(id)
        Card.findOneAndDelete({'id':e.id})
        .exec()
    });
})

app.post("/addcardsfromjson",(req,res)=>{
    cardArray=addcards();
    //Card.create(cardArray, function(err, docs){if (err) return res.send(500, {error:err});})
    
});
function addcards(){
               let value= require('./public/Card Data/Legendary Collection.json');
            let cards=[];
            let cardObj={};
        for (let i =0; i<value.length; i++)
        {
            let subtype = "";
            if (typeof value[i].subtypes !== 'undefined'){
                subtype = value[i].subtypes[0];
            }
            else{
                subtype = "";
            }
            cardObj={
                id: value[i].id,
            name: value[i].name,
            imageUrl: value[i].images.small,
            subtype: subtype,
            supertype: value[i].supertype,
            number: value[i].number,
            rarity: value[i].rarity,
            series: "Base",
            set: "Legendary Collection",
            setCode: "base6",
            imageUrlHiRes: value[i].images.large,
            inventory: 0,
            duplicateprints: [],
            artist: value[i].artist
            }
            cards.push(cardObj);
            
            Card.create(cardObj)
        };   
        
        console.log(cards)
        return cards;
      }

function updatecards(){
    let value=require('./public/Card Data/All Sets.json')
    let search="";
    let artist="";

    for(let i=0; i<value.length;i++){
        Card.collection.findOneAndUpdate(
            {"id":value[i].id},
            {$set:{"artist":value[i].artist}},
            
        )
    }
} 
function duplicateCardsUpdate(){      // this updates the duplicate field based on fields of duplicate cards... as of time I made this comment I think all of base series and energies were done
let dupesArr=[
	["neo2-2", "neo2-21"], 
	["neo2-3", "neo2-22"], 
	["neo2-4", "neo2-23"], 
	["neo2-5", "neo2-24"], 
	["neo2-6", "neo2-25"], 
	["neo2-7", "neo2-26"], 
	["neo2-8", "neo2-27"], 
	["neo2-9", "neo2-28"], 
	["neo2-10", "neo2-29"], 
	["neo2-11", "neo2-30"], 
	["neo2-12", "neo2-31"], 
	["neo2-14", "neo2-33"], 
	["neo2-15", "neo2-34"], 
	["neo2-16", "neo2-35"], 
	["neo2-17", "neo2-36"]
]

let newArr=[];
    for(let i=0; i<dupesArr.length;i++){
        for(let j=0; j<dupesArr[i].length;j++){
            newArr=[]
            for(let k=0; k<dupesArr[i].length;k++){
                
                if (k===j){
                }
                else{
                    newArr.push(dupesArr[i][k])
                    
                }
            }
            console.log(newArr)
            Card.collection.findOneAndUpdate(
                {"id":dupesArr[i][j]},
                {$set:{"duplicateprints":newArr}},
            
            )
        }
    }




}*/