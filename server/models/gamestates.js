const mongoose = require("mongoose");

const gameStateSchema = new mongoose.Schema({
        gamestateUUID: String,

        playerOneUUID: String,
        playerOneName: String,
        playerOneDeck: Array,
        playerOneDiscard: Array,
        playerOnePrizeCards: Array,
        playerOneHand: Array,
        playerOneStage: Array,

        playerTwoUUID: String,
        playerTwoName: String,
        playerTwoDeck: Array,
        playerTwoDiscard: Array,
        playerTwoPrizeCards: Array,
        playerTwoHand: Array,
        playerTwoStage: Array,

})

const gameState = mongoose.model("gameState",gameStateSchema);

module.exports = gameState;