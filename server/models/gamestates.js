const mongoose = require("mongoose");

const gameStateSchema = new mongoose.Schema({
        gameStateUUID: String,
        gameStateName: String,
        format: String,
        
        playerOneUUID: String,
        playerOneName: String,
        playerOneDeckName: String,
        playerOneDeck: Object,
        playerOneDiscard: Object,
        playerOnePrizes: Object,
        playerOneHand: Object,
        playerOneStage: Object,

        playerTwoUUID: String,
        playerTwoName: String,
        playerTwoDeckName: String,
        playerTwoDeck: Object,
        playerTwoDiscard: Object,
        playerTwoPrizes: Object,
        playerTwoHand: Object,
        playerTwoStage: Object,
        coinFlip: String,
        activeTime: Number

})

const gameState = mongoose.model("gameState",gameStateSchema);

module.exports = gameState;