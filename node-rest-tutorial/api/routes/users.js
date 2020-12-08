const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { model } = require('../models/user');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email}).exec().then(result=>{
        if(result.length >= 1){
            return res.status(409).json({
                message:"Mail Exists"
            });
        } else {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result=>{
                        console.log(result)
                        res.status(201).json({
                            message: 'User Created'
                        })
                    })
                    .catch(error=>{
                        console.log(error)
                        res.status(500).json({
                            error:error
                        })
                    });
                }
            });
        }
    })
});

router.delete('/:userId',(req,res,next)=>{
    User.remove({_id:req.params.userId}).exec()
    .then(result=>{
        return res.status(200).json({
            message:'User Deleted'
        });
    })
    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    });
});

module.exports = router;