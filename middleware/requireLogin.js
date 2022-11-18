const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.KEY

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.split(" ")[1]
    jwt.verify(token,JWT_KEY,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then((result)=>{
            req.user = result
            next()
        })
    })
}
