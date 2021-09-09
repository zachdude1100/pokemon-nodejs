const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema({
    deckName: String,
    notes: String,
    format: String,
    cards: Object   
})

const Deck = mongoose.model("deck",deckSchema);

module.exports = Deck;