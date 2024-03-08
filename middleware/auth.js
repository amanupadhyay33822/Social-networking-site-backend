const User = require("../models/User")
const jwt = require("jsonwebtoken");
 
require("dotenv").config({path:"config/.env"});

exports.isAuthenticated = async (req,res, next) => {
    try{ 
        console.log("hii")
       //fetch token
       const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    //check for empty token
    if(!token){
        return res.status(401).json({
            success:false,
            message:"token required",
        });
    }
    
    //verify token
    try{
      console.log(process.env.JWT_SECRET);

      const decoded = jwt.verify(token,process.env.JWT_SECRET)
      req.user= await User.findById(decoded._id);
     
      next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:err.message 
        });
    }
    }catch(error){
        return res.status(401).json({
            success:false,
            message:error.message
        });
    }
  
     
}

//http://localhost:3000/api/v1/login