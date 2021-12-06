const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

/*REGISTER */
router.post('/register', async (req, res) => {

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
            profilePicture: req.body.profilePicture,
            coverPicture: req.body.coverPicture
        })
        const  user = await newUser.save();
        res.status(200).json({
            user : user,
            request: {
                type: "POST",
                url: 'http://localhost:8800/api/auth/login'
            }
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

/*LOGIN*/
router.post('/login', async (req, res)=>{

    try {
        const userEmail = await User.findOne({email: req.body.email});
        !userEmail && res.status(404).json({
            message : 'User not found!'
        })
        const validPassword = await bcrypt.compare(req.body.password, userEmail.password)
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json({
            user : userEmail.username,
            request: {
                type: "POST",
                url: 'http://localhost:8800/api/auth/register'
            }
        })
    }catch (err) {
        console.log(err);
    }
})
module.exports = router;