import mongoose from "mongoose";
import House from "../models/House.js"
import Requests from "../models/VisitorRequest.js";
import { createError } from "../utils/CreateError.js";
import { removeImage } from "../utils/fileProcessing.js";
import { paginate } from "../utils/pagination.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();


export const createHouse = async (req, res, next) => {
    try {
        const owner = req.user;
        let {
            no_of_rooms,
            no_of_bath_rooms,
            width,
            length,
            house_type,
            bankaccounts,
            address,
            rent_amount,
            description,
            housenumber
        } = req.body;
        address = JSON.parse(address);
        bankaccounts = JSON.parse(bankaccounts);
        const images = req.files.map(file => ({ url: 'uploads/' + file.filename, path: file.destination + "/" + file.filename }));
        if (!images || images.length === 0)
            throw createError(400, "Atleast one image is mandatory!")

        const newHouse = await House.create({
            housenumber,
            owner,
            no_of_rooms,
            no_of_bath_rooms,
            width,
            length,
            images,
            house_type,
            bankaccounts,
            rent_amount,
            description,
            address
        });

        return res.status(200).json(newHouse);
    } catch (error) {
        if (req.files?.length > 0)
        req.files.forEach(async file => await removeImage(file.destination + '/' + file.filename))
        next(error)
    }
}


export const getHouse = async (req, res, next) => {
    const id = req.params.id;
    try {
        const house = await House.findById(id).select('-bankaccounts -occupancy_history -deadline -contract -housenumber');
        if (!house)
            throw createError(404, 'house not found');

        await house.populate({
            path: 'owner',
            foreignField: 'user',
            select: '-national_id ',
            populate: {
                path: 'user',
                select: '-role -password -isActive'
            }
        });
        
        const count = await House.countDocuments({tenant: null, owner: house.owner.user._id})
        return res.status(200).json({house, count});
    } catch (error) {
        return next(error);
    }
};

export const getHouses = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const start = (page - 1) * limit;
        
        const sort = req.query.sort ? {[req.query.sort]: -1} : {};

        const searchParams = {tenant: null}

        if (req.query.minrooms)
            searchParams.no_of_rooms = {...searchParams.no_of_rooms, $gte: parseInt(req.query.minrooms)}
        if (req.query.maxrooms)
            searchParams.no_of_rooms = {...searchParams.no_of_rooms, $lte: parseInt(req.query.maxrooms)}
        
        if (req.query.minprice)
            searchParams.rent_amount = {...searchParams.rent_amount, $gte: parseInt(req.query.minprice)}
        if (req.query.maxprice)
            searchParams.rent_amount = {...searchParams.rent_amount, $lte: parseInt(req.query.maxprice)}

        if (req.query.minsize) 
            searchParams.area = {...searchParams.area, $gte: parseFloat(req.query.minsize)}
        if (req.query.maxsize)
            searchParams.area = {...searchParams.area, $lte: parseFloat(req.query.maxsize)}

        if (req.query.types) {
            let types = typeof req.query.types === 'string' ? [req.query.types] : req.query.types;
            types = types.map((type) => new RegExp(type, 'i'))
            searchParams.house_type = {$in: types}
        }
        
        let address = []
        if (req.query.city) 
            address.push({"address.city": new RegExp(req.query.city, 'i')})
        if (req.query.sub_city) 
            address.push({"address.sub_city": new RegExp(req.query.sub_city, 'i')})
        if (req.query.woreda) 
            address.push({"address.woreda": new RegExp(req.query.woreda, 'i')})
        if (req.query.kebele) 
            address.push ({"address.kebele": new RegExp(req.query.kebele, 'i')})

        if (address.length > 0) {
            searchParams.$or = address
        }

        const ownerParams = {}
        if (req.query.q) {
            const q = new RegExp(req.query.q, 'i')
            const fields = [
                {'description':q},
                {'address.city':q},
                {'address.sub_city':q},
                {'address.woreda':q},
                {'address.kebele':q},
                {'house_type':q},
            ]
            searchParams.$or = fields
        }

        if (req.query.owner) {
            if (mongoose.Types.ObjectId.isValid(req.query.owner))
                searchParams.owner = new mongoose.Types.ObjectId(req.query.owner)
        }
        // Callculate the number of results
        const total = await House.countDocuments(searchParams)
        const data = await House.aggregate([
            {$addFields: {
                area: { $multiply: ['$width', '$length'] },
                images: "$images.url",
            }},
            {$match: searchParams},
            
            {$lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                pipeline: [{
                    $replaceRoot: {
                        newRoot: {
                            firstname: '$firstname',
                            lastname: '$lastname',
                            _id: '$_id'
                        },
                    },
                }],
                as: 'owner',
            }},
            {$unwind: '$owner'},
            {$sort: {createdAt: -1}},
            {$skip: start},
            {$limit: limit},
            {$project: {
                occupancy_history: 0,
                bankaccounts: 0,
                deadline: 0,
                contract: 0,
                calendar: 0,
                housenumebr: 0,
                description: 0
            }}
        ]);
        const result = paginate(page, limit, total, data.length>0?data:[]);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

export const editHouseInfo = async (req, res, next) => {
    try {
        let {
            housenumber,
            no_of_rooms,
            no_of_bath_rooms,
            width,
            length,
            house_type,
            bankaccounts,
            description,
            address,
            rent_amount
        } = req.body;
        
        
        const houseid = req.params.houseid;
        const house = await House.findOne({ _id: houseid, owner: req.user });


        house.housenumber = housenumber || house.housenumber;
        house.no_of_rooms = no_of_rooms || house.no_of_rooms;
        house.no_of_bath_rooms = no_of_bath_rooms || house.no_of_bath_rooms;
        house.width = width || house.width;
        house.length = length || house.length;
        house.house_type = house_type || house.house_type;
        house.description = description || house.description;
        house.rent_amount = rent_amount || house.rent_amount;
        house.address = address || house.address
        house.bankaccounts = bankaccounts || house.bankaccounts
        
        await house.save();
        return res.status(200).json(house);
    } catch (error) {
        next(error);
    }
}

export const editHouseImages = async (req, res, next) => {
    try {
        let { deletedImages } = req.body;
        deletedImages = new Set(JSON.parse(deletedImages));
        const house = await House.findOne({ _id: req.params.houseid, owner: req.user });
        let images = house.images;

        images.forEach(async ({ url, path }) => {
            if (deletedImages.has(url))
                await removeImage(path)
        });
        
        images = images.filter(({ url, path }) => !deletedImages.has(url));

        const addedImages = req.files.map(file => ({ url: 'uploads/' + file.filename, path: file.destination + "/" + file.filename }));
        addedImages.forEach((image) => {
            images.push(image);
        });
        house.images = images;
        await house.save();
        return res.status(200).json({ msg: 'Successfully updated photos', data: house.images })
    } catch (error) {
        next(error);
    }
}

export const addHouseCalendar = async (req, res, next) => {
    try {
        let { isOpen, schedules } = req.body;
        
        schedules = typeof schedules === 'string' ? JSON.parse(schedules) : schedules;
        const house = await House.findOne({ owner: req.user, _id: req.params.houseid });

        if (!house)
            throw createError(400, "House not found!!");

        let schedule = Array(7).fill(null);

        schedules.forEach(({ starttime, endtime, idx }) => {
            starttime = new Date(starttime);
            endtime = new Date(endtime);

            if ((starttime.getHours()+3)%24 >= (3+endtime.getHours())%24)
                throw createError(400, 'There must be morethan one hour difference between the two');

            schedule[idx] = {
                starttime,
                endtime
            }
        });

        house.calendar = {
            open: isOpen || house.open,
            schedule,
        }
        await house.save()
        return res.status(201).json({ message: "Successfully set calendar!", data: house.calendar });
    } catch (error) {
        next(error)
    }
}

export const getHouseVisits = async (req, res, next) => {
    try {
        const house = new mongoose.Types.ObjectId(req.params.id);
        if (req.headers.authorization) {
            const access_token = req.headers.authorization.split(' ')[1];
            jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
                if (!err)
                    req.user = decoded.user;
            });
        }


        const requests = await Requests.aggregate([
            {
                $match: {
                    house,
                    visitor: { $ne: new mongoose.Types.ObjectId(req.user) }
                }
            },
            {
                $addFields: {
                    truncDate: {
                        $dateTrunc: {
                            date: '$date',
                            unit: 'day'
                        }
                    },
                    hour: { $hour: '$date' }
                }
            },
            {
                $project: {
                    visitor: 0,
                    message: 0,
                    house: 0
                }
            },
            {
                $sort: {
                    hour: 1
                }
            },
            {
                $group: {
                    _id: '$truncDate',
                    requests: {
                        $push: {
                            date: '$date',
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        let date = null
        if (req.user) {
            date = await Requests.findOne({visitor: req.user, house}).select('date message');
        }
        return res.status(200).json({requests, date});
    } catch (error) {
        next(error);
    }
}

export const deleteHouse = async (req, res, next) => {
    const id = req.params.id;
    try {
        const house = await House.findOne({ _id: id, owner: req.user });
        if (!house)
            throw createError(400, 'House not found');
        await house.deleteOne();
        return res.status(200).json({ message: "successfully deleted" });
    } catch (error) {
        return next(error);
    }
};

