const express = require('express')
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const User = mongoose.model('User')

// get user details of loged in user
router.get('/user',requireLogin,(req,res)=>{
    // console.log(req.user)
    User.findOne({_id:req.user._id})
    .then((result)=>{
        const {name,followers,following} = result
        return res.json({
            Username:name,
            followers:followers.length,
            following:following.length
        })
    })
})

// follow user
router.put('/follow/:id',requireLogin,(req,res)=>{
    
    User.findByIdAndUpdate(req.params.id,
        {$push:{followers:req.user._id}},
        {new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,
                {$push:{following:req.params.id}},
                {new:true})
                .select('-password')
                .then((resData)=>{
                    res.json(resData)
                })
                .catch((err)=>{
                    return res.status(422).json({error:err})
                })
        })
})

// unfollow user
router.put('/unfollow/:id',requireLogin,(req,res)=>{
    
    User.findByIdAndUpdate(req.params.id,
        {$pull:{followers:req.user._id}},
        {new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,
                {$pull:{following:req.params.id}},
                {new:true})
                .select('-password')
                .then((resData)=>{
                    res.json(resData)
                })
                .catch((err)=>{
                    return res.status(422).json({error:err})
                })
        })
})

module.exports = router
