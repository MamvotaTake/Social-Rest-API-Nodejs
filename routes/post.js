const express = require("express");
const router = express.Router();
const Post = require('../models/Post')

router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})


router.put('/:id', async (req, res) => {
    try {
        const post = Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({$set: req.body})
            res.status(200).json({
                message: "The post has updated successfully"
            })
        } else {
            res.status(403).json({
                message: ' You can only update your post'
            })
        }
    }catch (err) {
        res.status(500).json({
            error: err
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const post = Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne({$set: req.body})
            res.status(200).json({
                message: "The post has deleted successfully"
            })
        } else {
            res.status(403).json({
                message: ' You can only delete your post'
            })
        }
    }catch (err) {
        res.status(500).json({
            error: err
        })
    }

})

router.put('/:id/like', async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes: req.body.userId}})
            res.status(200).json("The post has been liked")
        }else {
            await post.updateOne({$pull: {likes : req.body.userId}})
            res.status(200).json("The post has been disliked")
        }
    }catch (err) {
        res.status(500).json(err)
    }
})


router.get("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch (err) {
        res.status(500).json(err)
    }
})

router.get("/timeline/all", async (req, res)=>{
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId)=>{
               return Post.find({userId : friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    }catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;