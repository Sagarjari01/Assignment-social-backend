const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.KEY


// router.post('/signup',(req,res)=>{
//     const {name,email,password,pic} = req.body
//     if(!name || !email || !password){
//         return res.status(422).json({error:"Please fill all fields"})
//     }
//     User.findOne({email:email})
//     .then((savedUser)=>{
//         if(savedUser){
//             return res.status(422).json({error:"User already exists"})
//         }
//         bcrypt.hash(password,10)
//         .then((hashedPass)=>{
//             const user = new User({
//                 email,
//                 name,
//                 password:hashedPass,
//                 pic
//             })
//             user.save()
//             .then((uu)=>{
//                 return res.status(200).json({User:uu})
//             })
//             .catch(err=>{
//                 console.log(err)
//             })
//         })

//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// })

router.post('/authenticate',(req,res)=>{
    // console.log(req.headers)
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please fill all fields"})
    }
    User.findOne({email:email})
    .then((isSavedUser)=>{
        // console.log(isSavedUser)
        if(!isSavedUser){
            return res.status(400).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,isSavedUser.password)
        .then((isMatch)=>{
            if(isMatch){
                const token = jwt.sign({_id:isSavedUser._id},JWT_KEY)
                return res.json({token})
                // return res.status(200).json({message:"Signed is successfuly"})
            }
            return res.status(400).json({error:"Invalid email or password"})
        })

    })
})
module.exports = router