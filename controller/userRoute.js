
const express = require("express")
const Register = require("../model/Register");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRoute.post("/register", async(req,res) => {
    const {email, username, password} = req.body;
    const userByEmail = await Register.findOne({email})
    const userByusername = await Register.findOne({username})
    const hashpassword = await bcrypt.hash(password,10)
    if(userByEmail || userByusername){
        return res.json({message:"User existed"})
    }
    const newuser = new Register({email, username, password:hashpassword})
    await newuser.save()
    return res.json({message:"User registered succeddfully"});
})
userRoute.post("/login", async(req,res) => {
    const {username, password} = req.body;
    const user = await Register.findOne({username});
    if(!user){
        return res.json({message: "Invalid credentials"})
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return res.json({message:"Invalid credentials"})
    }
    const token = jwt.sign({id: user._id},"secret");
    res.cookie("token", token)
    return res.json({message:"Successfully login", id: user._id})
})
userRoute.post("/logout", async (req, res) => {
    try {
      res.clearCookie("token");
      return res.json({ message: "Logout successful" });
    } 
    catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
});
userRoute.get("/", async (req, res) => {
  try {
    const users = await Register.find({}, "_id email username");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = userRoute;