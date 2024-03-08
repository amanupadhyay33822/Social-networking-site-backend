const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config({path:"backend/config/.env"});

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please enter a username"]
    },
    name:{
        type:String,
        required:[true, "Please enter a name"]
    },
    avatar:{
      public_id:String,
      url:String,
    },
    email:{
        type:String,
        required:[true, "Please enter a email address"],
       
    },
    password:{
        type:String,
        required:[true, "Please enter a password"],
        minlength:[6,"Please enter at least 6 character"], 
        select:false
    },
    post:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
});
userSchema.pre("save", async function (next) {
    
    if(this.isModified("password")){
        
        this.password =  bcrypt.hash(this.password,10);
    }
    console.log(this.password)
    next();
})
userSchema.methods.matchPassword = async function (password){

    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken = async function () {
  return jwt.sign({_id:this._id},process.env.JWT_SECRET)
}

module.exports = mongoose.model("User",userSchema);



