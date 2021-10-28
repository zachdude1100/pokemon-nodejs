const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
        id: String,
        name: String,
        imageUrl: String,
        subtype: String,
        supertype: String,
        number: String,
        rarity: String,
        series: String,
        set: String,
        setCode: String,
        imageUrlHiRes: String,
        duplicateprints: Array,
        artist: String

})

const Card = mongoose.model("Card",cardSchema,"cards");

module.exports = Card;