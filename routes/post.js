const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Posts = mongoose.model('Posts')
const requireLogin = require('../middleware/requireLogin')

// get post with id
router.get('/posts/:id',requireLogin,(req,res)=>{
    Posts.findOne({_id:req.params.id})
    .then((result)=>{
        if(result){
           const {_id,likes,comments} = result
           return res.status(200).json({
            id:_id,
            likes:likes.length,
            comments:comments.length
            }) 
        }else{
            return res.status(422).json({error:"Post doesn't exists"})
        } 
    })
    .catch((err)=>{
        console.log(err)
        return res.json({error:"Invalid post ID"})
    })
})

// get all posts
router.get('/all_posts',requireLogin,(req,res)=>{
    Posts.find()
    .sort('-createdAt')
    .then((result)=>{
        
        const data =  result.map(obj=>{
            const {_id,title,description,likes,comments,createdAt} = obj
            return({
                id:_id,
                title,
                desc:description,
                likes:likes.length,
                comments:comments,
                createdAt
            })
        })
        return res.json(data)
    })
    .catch((err)=>{
        console.log(err)  
    })
})

// createPosts
router.post('/posts',requireLogin,(req,res)=>{
    const {title,description, photo} = req.body
    if(!title || !description || !photo){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    req.user.password = undefined
    const post = new Posts({
        title,
        description,
        photo,
        postedBy:req.user
    })
    post.save()
    .then((result)=>{
        
        const {_id,title,description} = result
        return res.json({
            id:_id,
            title:title,
            description:description,
            time:result.createdAt
        })
    })
    .catch((err)=>{
        console.log(err)
    })
})

// delete post created by user
router.delete('/posts/:id',requireLogin,(req,res)=>{
    Posts.findOne({_id:req.params.id})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        // console.log(post)
        if(post.postedBy._id.toString()===req.user._id.toString()){
            // console.log("posted by ID :",post.postedBy._id.toString(),"LoggedIn user ID: ",req.user._id.toString())
            post.remove()
            .then((data)=>{
                return res.status(200).json({message:"Post deleted successfully"})
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    })
})

// like post

router.put('/like/:id',requireLogin,(req,res)=>{
    Posts.findByIdAndUpdate(req.params.id,
        {$push:{likes:req.user._id}},
        {new:true}
        ).exec((err,result)=>{
            if(err){
                return res.json({error:err})
            }
            return res.json({result})
        })
})

// unlike post

router.put('/unlike/:id',requireLogin,(req,res)=>{
    Posts.findByIdAndUpdate(req.params.id,
        {$pull:{likes:req.user._id}},
        {new:true}
        ).exec((err,result)=>{
            if(err){
                return res.json({error:err})
            }
            return res.json({result})
        })
})

// comment on post

router.put('/comment/:id',requireLogin,(req,res)=>{
    const comment ={
        text:req.body.comment,
        postedBy:req.user._id
    }
    Posts.findByIdAndUpdate(req.params.id,
        {$push:{comments:comment}},
        {new:true}
        ).exec((err,result)=>{
            if(err){
                return res.json({error:err})
            }
            len = result.comments.length-1
            return res.json({CommentId:result.comments[len]._id})
        })
})

module.exports = router