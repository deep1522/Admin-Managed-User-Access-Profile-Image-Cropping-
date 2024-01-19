const express=require('express');
const User=require('../models/user')
const {body,validationResult}=require("express-validator")
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')

const JWT_SECRET='HelloWorld'

const router=express.Router();

// ROUTE 1:create a user using:"/api/auth/createuser". No longin Required
router.post('/Createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password').isLength({min:5})
], async(req,res)=>{
    let success=false
// If there are errors, return Bad request and the errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()})
    }
    // check whether the user with the same email already exists
    try {
    let user= await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({success,error:"sorry a user with this email already exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);

    // create a new user
    user =await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass
    })
    const data={
        user:{
            id:user.id
        }

    }
    success=true;
    const authToken=jwt.sign(data,JWT_SECRET)
    res.json({authToken})

} catch (error) {
    console.error(error.message );
    res.status(500).send("Internal Server error")
        
}
    
})
// ROUTE 2: Authenticating a user using:"/api/auth/login". No lonin Required

router.post('/Login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password cannot be blanked').exists()
], async(req,res)=>{
    let success=false;
    // If there are errors, return Bad request and the errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}=req.body;
    try {
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"Please try to login with correct credentials"});
        }
        const data={
            user:{
                
                id:user.id
            }
    
        }
        const authToken=jwt.sign(data,JWT_SECRET)
        success=true;
        res.json({success,authToken})

        
    } catch (error) {
        console.error(error.message );
        res.status(500).send("Internal Server Error")
            
    }

})
// ROUTE 3: Getlogged in User details  using:"/api/auth/getuser".  lonin Required
router.post('/Getuser', fetchuser,async(req,res)=>{
try {
    const UserId=req.user.id;
    const user=await User.findById(UserId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message );
    res.status(500).send("Internal Server Error")
        
}
})

module.exports=router