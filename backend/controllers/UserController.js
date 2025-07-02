import User from "../models/User.js";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
import Token from "../models/Tokens.js";
import { createError } from "../utils/CreateError.js";
import sendEmail from "../utils/email.js";
import { generateToken, refresh } from "../utils/generateTokens.js";
import Owner from '../models/Owner.js'
import Tenant from '../models/Tenant.js'
import dotenv from "dotenv";


dotenv.config();

export const register = async (req, res, next) => {
  try {

    const {  email, username, firstname, lastname, password, phonenumber } = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      password: hash,
      email,
      username,
      firstname,
      lastname,
      phonenumber
    });
    const user = await newUser.save();
    const {accesstoken, refreshtoken} = generateToken(user);
    
    const { password: p, isActive, ...otherDetails } = user._doc;
    await Token.create({refreshtoken, user: user._id});
    
    return res
      .status(200)
      .json({accesstoken, refreshtoken,  ...otherDetails});
    
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ $or: [{email: req.body.email, isActive: true}, {username: req.body.email, isActive: true}] });
    if (!user) 
      throw createError(404, "Username or password incorrect");
    
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      throw createError(400, "Username or password incorrect");
    
    const {accesstoken, refreshtoken} = generateToken(user);
    await Token.create({refreshtoken, user: user._id});
  
    const { password, isActive, ...otherDetails } = user._doc;
    return res
      .status(200)
      .json({accesstoken, refreshtoken, ...otherDetails });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    
    if (!identifier)
      throw createError(400, "Required field missing!");
    
    const user = await User.findOne({$or: [{email: identifier, isActive: true}, {username: identifier, isActive: true}, {email: identifier, verified: false}, {email: identifier, verified: false}]});
    
    if (!user)
      throw createError(400, "User not found");
    
    const token = refresh({ id: user._id }, '60m');

    await sendEmail(user.email, token);
    return res.status(201).json({msg: 'Email for reseting password sent!!', email: user.email});
  } catch (error) {
    next(error);
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token)
      throw createError(400, "Token not found");
    
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err)
        return res.status(401).json({msg: 'Invalid token'});
        
        req.user = decoded.id;
    });
    const user = await User.findById(req.user);
    if (!user)
      throw createError(400, 'User not found')
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    user.password = hash;
    user.isActive = true;
    user.verified = true;
    
    await user.save();
    
    const {accesstoken, refreshtoken} = generateToken(user)

    await Token.deleteMany({user: user._id});
    await Token.create({refreshtoken, user: user._id});

    const { password:p, isActive, ...otherDetails } = user._doc;
    
    return res
      .status(200)
      .json({ accesstoken, refreshtoken, ...otherDetails });
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const refreshtoken = req.body.refreshtoken;
    if (!refreshtoken)
      return res.status(400).send(createError(400, 'Not authenticated'));
    if (!await Token.exists({refreshtoken}))
      return res.status(400).send(createError(400, 'Not authenticated'));
    
    jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
        
      const accesstoken = refresh({user: decoded.user, role: decoded.role}, '20m');

      res.status(200).json({msg: "Refreshed", accesstoken});
    });
  
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const token = await Token.findOne({refreshtoken: req.body.refreshtoken});
    
    if (!token || token.user.toString() !== req.user)
      throw createError(404, "Tokens confilict occured while logingout!");

    await Token.deleteOne({refreshtoken: req.body.refreshtoken});
    res.status(200).json("User logged out");
  } catch (err) {
    next(err);
  }
}

export const editProfile = async (req, res, next) => {
  try {
    let { firstname, lastname, email, phonenumber, username } = req.body;
    const user = await User.findOne({_id: req.user, username: req.params.username}).select('-password -isActive');
    user.firstname = firstname || user.firstname; 
    user.lastname = lastname || user.lastname; 
    user.email = email || user.email; 
    user.phonenumber = phonenumber || user.phonenumber;
    user.username = username || user.username;
  
    await user.save()
    return res.status(200).json(user);
    
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select('-password -isActive');
    if (!user)
      throw createError(400, 'User not found');
    if (user.role === 'owner') {
      const owner = await Owner.findOne({user: user._id})
      return res.status(200).json({...user._doc, owner});    
    }

    return res.status(200).json(user);    
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -isActive');
    if (!user)
      throw createError(400, 'User not found')
    return res.status(200).json(user);
  } catch (error) {
    next(error)
  }
}
