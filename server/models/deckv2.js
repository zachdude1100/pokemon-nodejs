const mongoose = require("mongoose");
const Card=require("../models/card.js")
const deckSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deckName: String,
    notes: String,
    format: String,
    cards: [{
        card:{type: mongoose.Schema.Types.ObjectId,ref:"Card"},
        instances: String
    }]   
})

const DeckV2 = mongoose.model("decksV2",deckSchema,"decksv2");

module.exports = DeckV2;