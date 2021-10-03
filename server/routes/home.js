const express = require('express');
const router = express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth')


router.get("/",ensureAuth,(req,res)=>{
    res.render("home"); 
 
})
module.exports = router;