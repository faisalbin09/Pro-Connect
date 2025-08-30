  import User from "../models/user.model.js";
  import Profile from "../models/profile.model.js";
  import ConnectionRequest from '../models/connection.model.js';
  import Post from '../models/post.model.js';
  import bcrypt from "bcrypt";
  import crypto from "crypto";
  import PDFDocument from "pdfkit";
  import fs from "fs";
  import Comment from "../models/comments.model.js";

  const convertUserDataToPDF = async (userData) => {
      const doc = new PDFDocument

      const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
      const stream = fs.createWriteStream("uploads/" + outputPath);

      doc.pipe(stream);

      doc.image(`uploads/${userData.userId.profilePicture}`, {align: 'center', width: 100, marginbottom: "20px"});
      doc.fontSize(14).text(`Name: ${userData.userId.name}`,);
      doc.fontSize(14).text(`Username: ${userData.userId.username}`,);
      doc.fontSize(14).text(`Email: ${userData.userId.email}`,); 
      doc.fontSize(14).text(`Bio: ${userData.bio}`,);
      doc.fontSize(14).text(`Current Position: ${userData.currentPost}`,);

      doc.fontSize(14).text("Past Work : ")
      userData.pastWork.forEach((work, index) => {
          doc.fontSize(14).text(`Company: ${work.company}`);
          doc.fontSize(14).text(`Position: ${work.position}`);
          doc.fontSize(14).text(`Years: ${work.years}`);


  })
      doc.end();
      return outputPath;
  }

  export const register = async(req , res) =>{
      try{
          const{name , email , username , password} = req.body;
          if(!name || !email || !username || !password){
              return res.status(400).json({message : "All fields are required"});
          }

          const user = await User.findOne({email});
          if(user){
              return res.status(400).json({message : "User already exists"});
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
              name,
              email,
              username,
              password: hashedPassword
          });

          await newUser.save();
          const profile = new Profile({
              userId: newUser._id,
          });
          await profile.save();
          res.json({
              message: "User registered successfully",});

      }catch(err){
          return res.status(500).json({message : err.message});
      }
  }


  export const login = async(req , res) =>{
      try{
          const{email , password} = req.body;
          if(!email || !password){
              return res.status(400).json({message : "All fields are required"});
          }

          const user= await User.findOne({email});

          if(!user){
              return res.status(404).json({message : "User does not exist"});
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if(!isMatch){
              return res.status(400).json({message : "Invalid credentials"});
          }
          const token = crypto.randomBytes(32).toString("hex");

          await User.updateOne({ _id: user._id }, { token });

          return res.json({token : token});

      }catch(err){

      }
  }

  export const uploadProfilePicture = async(req, res) => {
      const {token } = req.body;
      try{
          const user = await User.findOne({token : token});
          if(!user){
              return res.status(404).json({message: "User not found"});
          }
          user.profilePicture = req.file.path;
          await user.save();
          return res.json({message: "Profile picture updated successfully"});

      }catch(err){
          return res.status(500).json({message: err.message});
      }
  }

  export const updateUserProfile = async(req, res) => {
      try{
          const {token , ...newUserData} = req.body;
          const user = await User.find({token : token});
          if(!user){
              return res.status(404).json({message: "User not found"});
          }
          const {username , email} = newUserData;
          const existingUser = await User.findOne({$or: [{username}, {email}]});
          if(existingUser){
              if(existingUser || String(existingUser._id) !== String(user._id)){
                  return res.status(400).json({message: "Username or email already exists"});
              }
          }
          Object.assign(user, newUserData);
          await user.save();
          return res.json({message: "User profile updated successfully"});
          }catch(err){
          return res.status(500).json({message: err.message});
      }
  }

  export const getUserAndProfile = async(req,res)=>{
      try{
          const { token } = req.query;
          const user = await User.findOne({token : token});
          if(!user){
              return res.status(404).json({message: "User not found"});
          }

          const userProfile = await Profile.findOne({userId: user._id}).populate('userId', 'name username email profilePicture');
          return res.json({userProfile});

      }catch(err){
          return res.status(500).json({message: err.message});
      }
  }

  export const updateProfileData = async(req, res) => {
      try{
          const { token, ...profileData } = req.body;
          const userProfile = await User.findOne({ token: token });
          if(!userProfile){
              return res.status(404).json({ message: "User not found" });
          }

          const profile_to_update = await Profile.findOne({ userId: userProfile._id });
          Object.assign(profile_to_update, profileData);
          await profile_to_update.save();
          return res.json({ message: "Profile updated successfully" });

      }catch(err){
          return res.status(500).json({ message: err.message });
      }
  }

  export const getAllUserProfile = async(req,res)=>{
      try{
          const profiles = await Profile.find().populate('userId', 'name username email profilePicture');
          return res.json({profiles});
      }
      catch(error){
          return res.status(500).json({message: error.message});
      }

  }

  export const downloadProfile = async(req,res)=>{
      const user_id = req.query.id;
      console.log(user_id);
      // return res.json({"message" : "not implemented"});

      const userPrfile = await Profile.findOne({userId: user_id}).populate('userId', 'name username email profilePicture');

      let outputPath = await convertUserDataToPDF(userPrfile);
      return res.json({outputPath});
  }

export const sendConnectionRequest = async (req, res) => {
  const { userId, connectionId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    if (String(user._id) === String(connectionId)) {
      return res.status(400).json({ message: "Cannot connect to yourself" });
    }

    const existingRequest = await ConnectionRequest.findOne({ userId: user._id, connectionId: connectionUser._id, });

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    const newConnection = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
      status: "pending",
    });

    await newConnection.save();
    return res.json({ message: "Connection request sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


  export const getMyConnectionRequests = async (req, res) => {
    const { token } = req.query;
    try {
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch requests received by the user
      const connections = await ConnectionRequest.find({ connectionId: user._id, status: "pending" })
        .populate("userId", "name username email profilePicture")
        .populate("connectionId", "name username email profilePicture");

      return res.json(connections);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  export const whatAreMyConnections = async (req, res) => {
    const { token } = req.query;
    try {
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const connections = await ConnectionRequest.find({
        $or: [{ userId: user._id }, { connectionId: user._id }],
        
      })
        .populate("userId", "name username email profilePicture")
        .populate("connectionId", "name username email profilePicture");

      return res.json({connections});
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;
    try {
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const connection = await ConnectionRequest.findById(requestId);
      if (!connection) {
        return res.status(404).json({ message: "Connection request not found" });
      }

      // Ensure only the recipient can accept/reject
      if (String(connection.connectionId) !== String(user._id)) {
        return res.status(403).json({ message: "Not authorized to accept this request" });
      }

      if (action_type === "accept") {
        connection.status = "accepted";
      } else if (action_type === "reject") {
        connection.status = "rejected";
      }

      await connection.save();
      return res.json({ message: "Connection request updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };



  export const commentPost = async(req,res)=>{
      const {token, post_id, commentBody} = req.body;
      try{
          const user = await User.findOne({token : token}).select("_id");
          if(!user){  
              return res.status(404).json({message: "User not found"});
          }
          const post = await Post.findById({_id : post_id});
          if(!post){
              return res.status(404).json({message: "Post not found"});
          }
          const comments = new Comment({
              userId: user._id,
              postId: post._id,
              body: commentBody
          })
          await comments.save();
          return res.status(200).json({message: "Comment added successfully", comment: comments});


      }catch(err){
          return res.status(500).json({message: err.message});
      }
  }

  export const getUserProfileAndUserBasedOnUsername = async(req,res)=>{
      const {username} = req.query;

      try {
    console.log("Looking for user:", username);

    const user = await User.findOne({ username });

    if (!user) {
      console.log("No user found with username:", username);
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate('userId', 'name username email profilePicture');

    return res.json({ profile: userProfile });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }


  }
