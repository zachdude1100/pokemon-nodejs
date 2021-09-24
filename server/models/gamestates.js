const mongoose = require("mongoose");

const gameStateSchema = new mongoose.Schema({
        gameStateUUID: String,
        gameStateName: String,
        
        playerOneUUID: String,
        playerOneName: String,
        playerOneDeck: Object,
        playerOneDiscard: Object,
        playerOnePrizes: Object,
        playerOneHand: Object,
        playerOneStage: Object,

        playerTwoUUID: String,
        playerTwoName: String,
        playerTwoDeck: Object,
        playerTwoDiscard: Object,
        playerTwoPrizes: Object,
        playerTwoHand: Object,
        playerTwoStage: Object,

})

const gameState = mongoose.model("gameState",gameStateSchema);

module.exports = gameState;