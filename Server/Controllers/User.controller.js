const { json } = require('express');
const User = require('../Models/User.model');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken'); 
const mongoose = require("mongoose");


const { sendConfirmationEmail, sendForgetPWEmail } = require('../utils/nodeMailer');


const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json("Email and password are required");
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json("Address not found");

        const isValidPassword = await bcryptjs.compare(req.body.password, user.password);
        if (!isValidPassword) return res.status(401).json("Incorrect email or password");

        if (!user.isActive) return res.status(401).json("Account is not activated, verify your email");
        //if (user.isAdmin) return res.status(401).json("Account is for admin");

        const token = jwt.sign(
            {
                _id: user._id,
                isActive: user.isActive,
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2 days",
            }
        );

    


      
        return res.status(200).json({ token: token, user: user });

    } catch (err) {
        console.error('Error:', err); // Log the error
        return res.status(500).json(err);
    }
};

const register = async (req, res) => {
    const codeG = "123456789azertyuiop^$qsdfghjklmù*wxcvbn&AZERTYUIOPMLKJHGFDSQWXCVBN";
    let activCod = "";
    for (let i = 0; i < 25; i++) {
        activCod += codeG[Math.floor(Math.random() * codeG.length)];
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(422).json("Email already exists");
        }

        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profilepic: req.body.profilepic,
            phone: req.body.phone,
            activationCode: activCod,
            isAdmin: req.body.isAdmin,
        });

        const savedUser = await newUser.save();
        sendConfirmationEmail(newUser.email, newUser.activationCode);
        return res.status(200).json(savedUser);
    } catch (err) {
        console.error('Error:', err); 
        return res.status(500).json(err);
    }
};


const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ activationCode: req.params.activationCode });

        if (!user) {
            return res.status(404).json({ message: "Invalid activation code" });
        }

        user.isActive = true;
        user.activationCode = null; // Optional: Clear the activation code after verification

        await user.save();

        res.status(200).json({ message: 'Account successfully verified' });
    } catch (err) {
        console.error('Error:', err); // Log the error
        res.status(500).json({ message: 'Internal server error' });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (!userExist) {
            return res.status(422).json({
                message: "Email is not valid",
            });
        }

        // Generate a reset token
        const resetToken = generateResetToken();

        // Save reset token to the user and save the user
        userExist.resetToken = resetToken;
        await userExist.save();

        // Send the reset token via email
        sendForgetPWEmail(userExist.email, resetToken);

        return res.status(200).json({
            message: "Check your inbox to reset your password",
        });
    } catch (err) {
        console.error('Error:', err); // Log the error
        return res.status(500).json(err);
    }
};

// Helper function to generate a reset token
const generateResetToken = () => {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "Reset token and new password are required" });
        }

        const user = await User.findOne({ resetToken });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetToken = null; // Clear the reset token after successful password reset

        await user.save();

        return res.status(200).json({ message: "Your password has been changed" });
    } catch (err) {
        console.error('Error:', err); // Log the error
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getUser = async (req, res) => {
    const email = req.params.email; 
    try {
      const user = await User.findOne({ email }); 
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json(user);
    } catch (err) {
      console.error('MongoDB Query Error:', err);
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
    }; 



    const getUserById = async (req, res) => {
        const userId = req.params.id;
      
        if (!mongoose.isValidObjectId(userId)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }
      
        try {
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          return res.status(200).json(user);
        } catch (err) {
          console.error('MongoDB Query Error:', err);
          return res.status(500).json({ message: "Internal server error", error: err.message });
        }
      };




      const updateUserStatus = async (req, res) => {
        const id = req.params.id;
        const { isBlocked } = req.body;
    
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { isBlocked }, // Simplified object assignment
                { new: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            return res.status(200).json(updatedUser);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    };
    



    const getAllUsers = async (req, res) => {
        try {
          const users = await User.find(); // Retrieves all users from the database
      
          if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
          }
      
          return res.status(200).json(users);
        } catch (err) {
          console.error('MongoDB Query Error:', err);
          return res.status(500).json({ message: "Internal server error", error: err.message });
        }
      };
      

      const deleteUser = async (req, res) => {
        const id = req.params.id;
      
        try {
          const deletedUser = await User.findByIdAndDelete(id);
      
          if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          return res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };


      const updateUser = async (req, res) => {
        const { id } = req.params;
        const { username, phone, email } = req.body;
      
        try {
          const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, phone, email },
            { new: true }
          );
      
          if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          return res.status(200).json(updatedUser);
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
      
module.exports = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getUser,
    getUserById,
    updateUserStatus,
    getAllUsers,
    deleteUser,
    updateUser
};
