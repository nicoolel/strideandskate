const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
  // get profile by finding the user
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getMyPosts: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("myPosts.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      // find posts and sort from the most recent to the least recent
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      // find post based on user ID
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // upload media file - img or video
      // use cloudinary to upload the file that was submitted with the form
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        start_offset: "2"
      });
      // create post based on the following items
      await Post.create({
        title: req.body.title,
        // grab url and ID off the result - the path came back from cloudinary (secure_url and public_id)
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id
      });
      console.log("Post has been added!");
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      //goes to Model - don't need to do db.collection 
      // find the id of the post and like it. this auto updates to add a like
      await Post.findOneAndUpdate(
        // find a document where the id matches the id from the URL
        { _id: req.params.id },
        {
          // increment (increase) the likes property by 1
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  dislikePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id},
        {
          $inc: { likes: -1},
        }
      );
      console.log("Likes -1")
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err); 
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
