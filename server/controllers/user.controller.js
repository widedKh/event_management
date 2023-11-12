const User = require("../models/user.model");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt.config.js");
 

module.exports = {
    register: async (req, res) => {
        try {
            const user = await User.create(req.body); 
            const token = jwt.sign({ id: user._id }, secret);
            res.cookie("userToken", token, {
                 withCredentials: true ,
                 httpOnly: true,
                 }).json({ msg: "login successfuly", token, name: user.firstName });


        } catch (err) {
            console.error(err);
            return  res.status(404).json({ message: "you have an error", error: err }) 
        }
    },

    // login controller
   login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (user === null) {
                return res.status(400).json({ msg: "Invalid login attempt." });
            }

            const isValid = await bcrypt.compare(req.body.password, user.password);

            if (isValid) {
                const token = jwt.sign({ id: user._id }, secret);
                res.cookie("userToken", token, { 
                    withCredentials: true ,
                    httpOnly: true
                 }).json({ msg:  "login successfuly",token, name: user.firstName, user: { _id: user._id } });
            
            } else {
                return res.status(400).json({ msg: "Invalid login attempt!" });
            }
        } catch (err) {
            console.error(err);
            return res.status(400).json({ msg: "Invalid login attempt!" ,error: err});
        }
    }, 


    findAllUser:(req, res)=>{
        User.find()
        .then(allUsers=>{
            console.log(allUsers)
            res.json({allUsers})
        })
        .catch(err=>{res.json({message:"error"})})
      },

    findOneUser :(req, res) => {
     const userId = req.params.id; // Get the user ID from the request
  
    // Check if the userId is a valid ObjectId
     if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
     }
  
    // If the userId is valid, use it to find the user
     User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error fetching user details', error: err });
      });
  },
  

    logout: (req, res) => {
        res.clearCookie('userToken');
        res.json({ message: 'You are logged out' });
    }
}   
