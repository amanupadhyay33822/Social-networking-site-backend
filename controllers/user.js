const User = require("../models/User");
const bcrypt = require("bcrypt")


require("dotenv").config({path:"config/.env"});


exports.register = async (req,res) => {
    try{
        //fetch data
       const {name,email,password,username}= req.body;


       //validation
       if(!email || !password || !name ){
        return  res.status(400).json({
            sucess: false,
            message: "Fill all the details " 
        })
       }


       //check if the user is already registered
       let user = await User.findOne({email})
       if(user){
        return  res.status(400).json({
            sucess: false,
            message: "user already registered"
        })
       }
      let hashedPassword = await bcrypt.hash(password,10);
       user = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
        avatar:{
                 public_id:"sample_id",
                 url:"sample_url",
            }});

            // console.log(req.user.email);
            await user.save();
            res.status(201).json({
              sucess: true,
              user,
              message:"User log in sucessfully"
            })
            

    //    //secure password
    //    let hashedPassword ;

    //    try{
    //    hashedPassword = await bcrypt.hash(password,10);
    //    }catch(err){
    //     return  res.status(403).json({
    //         sucess: false,
    //         message: "error in hashing the password"
    //     })
    //    }

    //    //create entry in db
    //    user = await User.create({name,email,password:hashedPassword,
    //     avatar:{
    //         public_id:"sample_id",
    //         url:"sample_url",
    //     }});
    //     let options= {
    //       expires:new Date( Date.now() + 3*24*60*60*1000),
    //       httpOnly: true,
          
    //     }
    //     const token = await user.generateToken();
    //  return  res.cookie("token",token,options).status(200).json({
    //     sucess:true,
    //     token,
    //     user,
    //     message:"User log in sucessfully"
    //   })



    }catch(err){
        return  res.status(400).json({
            sucess: false,
            message: err.message 
        })
    }
}

//login

exports.login = async (req,res) => {
    try{
  //data fetch
  
  const {email,password} = req.body;
  //check if all data present or not
  if(!email || !password ){
    return  res.status(401).json({
        sucess: false,
        message: "fill all details "
    })
  }
  // match email
  
   let user = await User.findOne({email}).select("+password");
  // console.log(user.password)
   if(!user){
    return  res.status(400).json({
        sucess: false,
        message: "user is not registered" 
    })
   } 
   
   const isMatch = await user.matchPassword(password);
   
   
   if(!isMatch) {
    return res.status(400).json({
      sucess: false,
      message: "Incorrect password"
    })
   }
let options= {
  expires:new Date( Date.now() + 3*24*60*60*1000),
  httpOnly: true,
  
}

   const token = await user.generateToken();
   return  res.status(200).cookie("token",token,options).json({
            sucess:true,
            token,
            user,
            message:"User log in sucessfully"
          })


          
    }catch(error){
        return  res.status(400).json({
            sucess: false,
           
            message:error.message
        })
    }

}

//follow 

exports.followUser = async (req,res) => {
  try{
  
      //find user jisko follow krna hai
      const userToFollow = await User.findById(req.params.id.toString());
      //find login user jo follow kr rha hai
      const loggedInUser = await User.findById(req.user._id);
   console.log(req.user)
    console.log(loggedInUser)
      if(!userToFollow){
        return  res.status(400).json({
          sucess: false,
         
          message:"User not found"
      })
      }
     //if alredy follow kr chuka hai
     if(loggedInUser.following.includes(userToFollow._id)){
      
     const indexfollowing = loggedInUser.following.indexOf(userToFollow._id)
     loggedInUser.following.splice(indexfollowing, 1)

     const indexfollower = userToFollow.followers.indexOf(loggedInUser._id)
     userToFollow.followers.splice(indexfollower, 1)

     await loggedInUser.save()
     await userToFollow.save()

     return res.status(200).json({
      sucess:true,
      message:"User unfollowed successfully",
    })

     }else{
      //push id of userTofollow in following object of loggedIn user
   loggedInUser.following.push(userToFollow._id);

   userToFollow.followers.push(loggedInUser._id);
   
   await loggedInUser.save();
   await userToFollow.save();

   
     
   return res.status(200).json({
     sucess:true,
     message:"User followed successfully"
   })
     }


      
  }catch(error){
    return  res.status(400).json({
      sucess: false,
     
      message:error.message
  })
  }

}


exports.logout = async (req,res) => {
  try {
     res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
      sucess:true,
      message:"log out sucessfully"
     })
  } catch (error) {
    return  res.status(400).json({
      sucess: false,
     
      message:error.message
  })
  }
}

// exports.updatePassword = async (req,res) => {
//   try {
//       //find user 
//       console.log(req.user)
//       const user = await User.findById(user._id).select("+password");
     
//       //fetch data
//       const {oldPassword,newPassword} = req.body;
//       //check for no entry
//       if(!oldPassword || !newPassword){
//         return res.status(404).json({
//           sucess: false,
//           message: "Please enter all information about password"
//         })
//       }
//       const isMatch =  await user.matchPassword(oldPassword)
//       if(!isMatch){
//         return res.status(404).json({
//           sucess: false,
//           message: "incorrect old password"
//         })
//       }

//         password = newPassword
//        return res.status(200).json({
//         sucess: true,
//         message: "Password updated successfully"
//       })


//   } catch (error) {
//     return  res.status(400).json({
//       sucess: false,
     
//       message:error.message
//   })
//   }
// }