const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/rengoku/image/upload/v1629548647/user_aioban.png"
    },
    followers:[{type:'ObjectId',ref:'User'}],
    following:[{type:'ObjectId',ref:'User'}]
})

mongoose.model('User',UserSchema)