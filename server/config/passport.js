const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports=function(passport){
    passport.use(new GoogleStrategy({
        clientID:'453339548549-hpqctms98llnljmchb5ok40ucoqiqohe.apps.googleusercontent.com',
        clientSecret:'wQWg-vShgfxAXFoJ0UkzuUJh',
        callbackURL:'/auth/google/callback'
    },
    async(accessToken,refreshToken,profile,done)=>{
        const newUser={
            googleId:profile.id,
            displayName:profile.displayName,
            image:profile.photos[0].value
        }
        try{
            let user=await User.findOne({googleId:profile.id})
            if(user){
                done(null,user)
            }
            else{
                user=await User.create(newUser)
                done(null,user)
            }
        }
        catch(err){
            console.error(err)
        }
    }
    
    ))

    passport.serializeUser(function (user,done){
        done(null,user.id)
    })
    passport.deserializeUser(function (id,done){
        User.findById(id,function(err,user){
            done(err,user)
        })
    })
}