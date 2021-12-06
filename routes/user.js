const express = require("express");

const  router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");

/*UPDATE USER*/
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.compare(req.body.password, salt)

            }catch (err) {
                res.status(500).json(err)
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body,
            });
            res.status(200).json({
                message: "Account has successfully updated!",
                username: user.username
            })
        }catch (err) {
            res.status(403).json("You can only update your account!")
        }

    }else {
        return res.status(403).json("You can only update your account!")
    }

})

/*DELETE USER*/
router.delete('/:id', async (req, res)=>{
    if (req.params.userId === req.body.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message : "Account has successfully deleted!",
                request: {
                    type: 'POST',
                    url:  'http://localhost:8800/api/auth/register'
                }

            })
        }catch (err) {
            res.status(500).json(err)
        }
    }else {
        return res.status(403).json({
            message : "You can only delete your account!"
        })
    }
})

/*GET A USER*/
router.get('/:id', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...others} = user._doc
        res.status(200).json({
            user : others
        })
    }catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})


/*FOLLOW A USER*/
router.put('/:id/follow', async (req, res)=>{
    if(req.body.userId === req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers: req.body.userId}})
                await currentUser.updateOne({$push:{following: req.params.id}})
                res.status(200).json({
                    message : ' User has been followed!'
                })
            } else {
                res.status(403).json("You already follow this user")
            }
        }catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }else {
        res.status(403).json({
            message : "You can't follow yourself!"
        })
    }
})

/*UNFOLLOW A USER*/
router.put('/:id/unfollow', async (req, res)=>{
    if(req.body.userId === req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers: req.body.userId}})
                await currentUser.updateOne({$pull:{following: req.params.id}})
                res.status(200).json({
                    message : ' User has been unfollowed!'
                })
            } else {
                res.status(403).json("You already unfollow this user")
            }
        }catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }else {
        res.status(403).json({
            message : "You can't unfollow yourself!"
        })
    }
})
module.exports = router;