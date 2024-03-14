const User = require("../models/User");
const bcrypt = require("bcrypt");
const argon2 = require("argon2");

require("dotenv").config({ path: "config/.env" });

const uuid = require("uuid");

exports.register = async (req, res) => {
  try {
    // Fetch data
    const { name, email, password, username } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Fill all the details ",
      });
    }

    // Check if the user is already registered
    let user = await User.findOne({ email });

    if (user) {
      // If the user exists,

      return res.status(400).json({
        success: false,

        message: "User Already exist",
      });
    }

    // Generate unique user ID using uuid
    const userId = uuid.v4();

    // If the user doesn't exist, proceed with registration as before
    let hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      userId, // Assign generated userId
      username,
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: "sample_id",
        url: "sample_url",
      },
    });

    await user.save();

    return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    //data fetch

    const { email, password } = req.body;
    //check if all data present or not
    if (!email || !password) {
      return res.status(401).json({
        sucess: false,
        message: "fill all details ",
      });
    }
    // match email

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "user is not registered",
      });
    }
    // const isMatch = await argon2.verify(user.password, password);
    // const isMatch = await user.matchPassword(password);

    // const x = await bcrypt.compare(password, user.password);
    // console.log(x);
    // if (!isMatch) {
    //   return res.status(400).json({
    //     sucess: false,
    //     message: "Incorrect password",
    //   });
    // }
    let options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    const token = await user.generateToken();
    return res.status(200).cookie("token", token, options).json({
      sucess: true,
      token,
      user,
      message: "User log in sucessfully",
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,

      message: error.message,
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    // Find the user by ID
    const user = await User.findOne({ userId });
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete the user from the database
    await user.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "User profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { name, email, username, bio } = req.body;
    const userId = req.user._id; // Assuming you have middleware to authenticate and attach the user to the request

    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields if provided in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // Save the updated user
    user = await user.save();

    return res.status(200).json({
      success: true,
      user,
      message: "User details updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//follow

exports.followUser = async (req, res) => {
  try {
    //find user jisko follow krna hai
    const userToFollow = await User.findById(req.params.id.toString());
    //find login user jo follow kr rha hai
    const loggedInUser = await User.findById(req.user._id);
    console.log(req.user);
    console.log(loggedInUser);
    if (!userToFollow) {
      return res.status(400).json({
        sucess: false,

        message: "User not found",
      });
    }
    //if alredy follow kr chuka hai
    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(indexfollowing, 1);

      const indexfollower = userToFollow.followers.indexOf(loggedInUser._id);
      userToFollow.followers.splice(indexfollower, 1);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        sucess: true,
        message: "User unfollowed successfully",
      });
    } else {
      //push id of userTofollow in following object of loggedIn user
      loggedInUser.following.push(userToFollow._id);

      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        sucess: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      sucess: false,

      message: error.message,
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const id = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        sucess: true,
        message: "log out sucessfully",
      });
  } catch (error) {
    return res.status(400).json({
      sucess: false,

      message: error.message,
    });
  }
};

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