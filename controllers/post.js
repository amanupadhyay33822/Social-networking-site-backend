const { response } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    console.log(req.user);
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "public id",
        url: "url",
      },
      owner: req.user._id,
    };
    //creating entry in db
    const newPost = await Post.create(newPostData);

    const user = await User.findById(req.user._id);

    user.post.push(newPost._id);

    await user.save();

    return res.status(200).json({
      sucess: true,
      post: newPost,
    });
  } catch (err) {
    return res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    //jis post ko delete krna us post ki id ko params me bhejo and extract
    const post = await Post.findById(req.params.id);
    //for no post
    //    console.log("he")
    if (!post) {
      return res.status(400).json({
        sucess: false,
        message: "post not found",
      });
    }

    //check login user id is same as owner id -- if true then only user can delete post
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        sucess: false,
        message: "unauthorized user",
      });
    }

    //remove the post
    await post.deleteOne();
    //delete entry of post from user scheme too
    //find user
    const user = await User.findById(req.user._id);
    //find index of post
    const index = user.post.indexOf(req.params.id);

    //remove entry of that index
    user.post.splice(index, 1);

    await user.save();

    return res.status(404).json({
      sucess: true,
      message: "post deleted",
    });
  } catch (error) {
    return res.status(404).json({
      sucess: false,
      message: error.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    //fetch post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        sucess: false,
        message: "post not found",
      });
    }
    //for unlike post
    //1- kya user ki id post ke like wale array me hai? check kro
    //2- agar hai to-
    //3- kis index par hai ye pta kro
    //4- then us index ki id ko delete kro
    //5- save kr do post ko
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);

      post.likes.splice(index, 1);

      await post.save();

      return res.status(200).json({
        sucess: true,
        message: "Post unliked",
      });
    } else {
      //like the post
      post.likes.push(req.user._id);

      await post.save();

      return res.status(200).json({
        sucess: true,
        message: "Post liked",
      });
    }
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};

exports.getPostOfFollowing = async (req, res) => {
  try {
    //find user"
    const user = await User.findById(req.user._id);

    const post = await Post.find({
      owner: {
        $in: user.following,
      },
    });

    return res.status(400).json({
      sucess: true,
      post,
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};
