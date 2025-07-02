import Owner from "../models/Owner.js";
import User from "../models/User.js";
import { createError } from "../utils/CreateError.js";
import { removeImage } from "../utils/fileProcessing.js";
import mongoose from "mongoose";
import House from "../models/House.js";
import { generateToken } from "../utils/generateTokens.js";
import Token from "../models/Tokens.js";


export const addOwner = async(req, res, next) => {
    try {
        let { address } = req.body;
        address = JSON.parse(address);
        const user = await User.findById(req.user).select('-password -isActive');
        
        if (!user) 
            throw createError(400, "User not found");
        
        user.role = 'owner';
        await user.save();
        const newOwner = new Owner({
            address,
            user,
            national_id : {
                url: "nationalids/"+req.file.filename,
                path: req.file.destination+"/"+req.file.filename
            }
        });
        

        const savedOwner = await newOwner.save();
        const { accesstoken, refreshtoken } = generateToken(user);
        await Token.deleteMany({user: user._id});
        await Token.create({
            refreshtoken,
            user: user._id
        })
        return res.status(201).json({accesstoken, refreshtoken, savedOwner});
    } catch (error) {
        if (req.file)
            await removeImage(req.file.destination+"/"+req.file.filename)

        next(error);
    }
};

export const getOwner = async (req, res, next) => {
    try {
        const id = mongoose.isObjectIdOrHexString(req.params.username) ? req.params.username : null;
        const user = User.findOne({$or: [{username: req.params.username}, {_id: req.params.username}]});
        if (!user)
            throw createError(400, 'Owner not found')
        const owner = await Owner.findOne({user: user._id});
        if (!owner)
            throw createError(400, 'Not an owner')
        return res.status(200).json({owner, user});
    } catch (error) {
        next(error)
    }
}

export const editProfile = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let { firstname, lastname, email, phonenumber, username, address} = req.body;
        if (address)
            address = JSON.parse(address)
        
        const user = await User.findById(req.user);
        const owner = await Owner.findOne({user: req.user});
        user.firstname = firstname || user.firstname; 
        user.lastname = lastname || user.lastname; 
        user.email = email || user.email; 
        user.phonenumber = phonenumber || user.phonenumber;
        user.username = username || user.username;
        owner.address = address || user.address;
        
        let previousImage = null
        if (req.file) {
            previousImage = owner.national_id.path
            owner.national_id = {
                url: "nationalids/"+req.file.filename,
                path: req.file.destination+"/"+req.file.filename
            }
        }
        await user.save({session})
        await owner.save({session});
        await session.commitTransaction();

        if (previousImage)
            await removeImage(previousImage);

        return res.status(200).json({owner, user})
    } catch (error) {
        await session.abortTransaction();
        if (req.file)
            await removeImage(req.file.destination+"/"+req.file.filename)
        next(error)
    } finally {
        await session.endSession();
    }
}

export const deleteOwner = async(req,res,next) =>{
    const ownerId  = req.user;
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const owner = await Owner.findById(ownerId);

        const houses = await House.find({owner:ownerId});
        houses.forEach(async (house) => {
            await house.deleteOne().session(session);
        });
        await Owner.findOneAndDelete({user: ownerId}).session(session);
        await User.findByIdAndDelete(owner.user).session(session);

        const path = owner.national_id.path;

        await session.commitTransaction();
        await session.endSession();
        await removeImage(path);
        
        return res.status(200).json({msg: 'Successfully Deleted This owner'});

    } catch (error) {
        await session.abortTransaction()
        await session.endSession();
        next(error)
    }
}

export const occupancyHistory = async (req, res, next) => {
    try {

        const searchParams = {}
        if (req.query.q) {
            const q = new RegExp(req.query.q, 'i')
            const fields = [
                {firstname:q},
                {lastname:q},
                {email: q},
                {phonenumber: q}
            ]
            searchParams.$or = fields
        }
        let history = await House.find({owner: req.user, occupancy_history: {$ne: []}}).select('housenumber tenant occupancy_history.tenant occupancy_history.from occupancy_history.upto')
        .populate(
            {
                path: 'occupancy_history.tenant', 
                foreignField: '_id',
                model: 'User', 
                select: 'firstname lastname email phonenumber', 
                match: searchParams,
            }
        );
        
        history = history.map(his => {
            his.occupancy_history = his.occupancy_history.filter(({tenant}) => tenant !== null)
            return his
        });
        return res.status(200).json(history);
    } catch (error) {
        next(error)
    }
}

export const currentTenant = async (req, res, next) => {
    try {
        const house = await House.findOne({owner: req.user, _id: req.params.houseid}).select('tenant')
        .populate({path: 'tenant', foreignField: 'user', populate: {path: 'user', select: '-password -role'}});
        // Include Payment informations here if needed;
        return res.status(200).json(house.tenant)
    } catch (error) {
        next(error);
    }
}

export const getHouses = async (req, res, next) => {
    try {
        const houses = await House.find({owner: req.user}).select('housenumber no_of_rooms no_of_bath_rooms address rentamount house_type length width images');
        return res.status(200).json(houses)
    } catch (error) {
        next(error)
    }
}

export const getSingleHouse = async (req, res, next) => {
    try {
        const house = await House.findOne({owner: req.user, _id: req.params.houseid}).populate({path: 'tenant', model: 'User', select: '-isActive -password'});
        return res.status(200).json(house);
    } catch (error) {
        next(error)
    }
}
