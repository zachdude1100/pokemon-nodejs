const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
        id: String,
        name: String,
        imageUrl: String,
        subtype: String,
        supertype: String,
        number: Number,
        rarity: String,
        series: String,
        set: String,
        setCode: String,
        imageUrlHiRes: String,
        inventory: Number,
        duplicateprints: Array,
        artist: String

})

const Card = mongoose.model("card",cardSchema);

module.exports = Card;