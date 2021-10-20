const express = require('express');
const router = express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const inventoryController = require('../controllers/inventory_controller.js');


router.get("/",ensureAuth,(req,res)=>{
    res.render("inventory_home");
})

router.get("/:setcode",ensureAuth,inventoryController.returnUserCardsInFormat)
router.post("/submit",ensureAuth,inventoryController.updateCardInv)

module.exports = router;