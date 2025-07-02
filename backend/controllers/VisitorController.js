import mongoose from "mongoose";
import House from "../models/House.js";
import User from "../models/User.js";
import Requests from "../models/VisitorRequest.js";
import { createError } from "../utils/CreateError.js";

export const createVisitorRequest = async (req, res, next) => {
    try {
        const date = new Date(req.body.date);
        const message = req.body.message;

        const house = await House.findById(req.params.houseid).select('calendar');
        const visitor = await User.findById(req.user);

        const {schedule} = house.calendar;
        
        const day = schedule[(6+date.getDay()) % 7];
        if (!day)
            throw createError(400, "The house have no schedule this day");


        const start = new Date().setHours(day.starttime.getHours(), day.starttime.getMinutes(), 0 ,0);

        const end = new Date().setHours(day.endtime.getHours(), day.endtime.getMinutes(), 0, 0);
        const current = new Date().setHours(date.getHours(), date.getMinutes(), 0, 0);

        
        if (current<start || current > end)
            throw createError(400, "The house have no schedule this time")

        if (house.calendar.open) {
            const request = await Requests.findOneAndUpdate( {
                    house: house._id,
                    visitor: visitor._id
                }, {
                open: true,
                visitor,
                house,
                date,
                message
            }, {upsert: true});
            return res.status(200).json({msg: `Successfully booked`, data: request});
        }
        const truncDate = new Date(date.toDateString())

        const schedules = await Requests.aggregate([
            {
                $addFields:{
                    truncDate: {$dateTrunc: {
                        date: '$date',
                        unit: 'day'
                    }},
                    hour: {$hour: '$date'}
                },
            
            },
            {
                $match: {
                    truncDate
                },
            },
            {
                $sort: {
                    hour: 1
                }
            }
        ]);
        
        const endtime = new Date(date)
        endtime.setHours(endtime.getHours()+1, endtime.getMinutes(), 0, 0)

        for(let index = 0; index < schedules.length; index ++) {
            if (schedules[index].visitor.toString() === visitor._id.toString())
                continue
            const s = new Date(schedules[index].date);
            const e = new Date(schedules[index].date);
            e.setHours(s.getHours() + 1, s.getMinutes(), 0, 0);
            
            if ((s<date && date<e) || (s<endtime && endtime<e))
                throw createError(400, "This time interfeers with another time!")
        }

        const request = await Requests.findOneAndUpdate({
                visitor: visitor._id,
                house: house._id,
            },  {
            open: false,
            visitor,
            house,
            date,
            message
        }, {upsert: true});
        return res.status(200).json({msg: `Successfully booked`, data: request});
    } catch (error) {
        next(error)
    }
}

export const getVisitRequests = async (req, res, next) => {
    try {
        const house = await House.find({
            owner: req.user,
            house: req.params.houseid,
        });

        if (!house)
            throw createError(400, 'House not found!!');
        const requests = await Requests.find({
            house: house._id
        }).sort({date: 1}).populate({ path: 'visitor', select: '-password -role -isActive'});
        
        return res.status(200).json(requests);
    } catch (error) {
        
    }
}

export const getRequests = async (req, res, next) => {
    try {
        const requests = await Requests.find({
            visitor: req.user
        }).populate({
            path: 'house', 
            select: 'images address rent_amount no_of_rooms house_type _id',
        });
        return res.status(200).json(requests);
    } catch (error) {
        next(error)
    }
}

export const deleteRequest = async (req, res, next) => {
    try {
        await Requests.deleteOne({house: req.params.id, visitor:req.user});
        return res.status(200).json('Deleted the request for ');
    } catch (error) {
        next(error)
    }
}

export const getOwnerRequests = async (req, res, next) => {
    try {
        const ownerId = new mongoose.Types.ObjectId(req.user)

        const searchParam = {}
        const searchName = {}

        if (req.query.start)
            searchParam.date = {...searchParam.date, $gte: new Date(req.query.start)}
        if (req.query.end)
            searchParam.date = {...searchParam.date, $lte: new Date(req.query.end)}
        
        if (req.query.name && req.query.name !== '') {
            const q = new RegExp(req.query.name, 'i')
            searchName.fullname = q
        }

        const requests = await Requests.aggregate([
            {$match: searchParam},
            {$group: {
                    _id: "$house",
                    requests: {$push: "$$ROOT"}
                }
            },
            {$project: {
                    'requests.house': 0,
                }
            },
            {$lookup: {
                    from: 'houses',
                    localField: '_id',
                    foreignField: '_id',
                    pipeline: [{
                        $replaceRoot: {
                            newRoot: {
                                housenumber: '$housenumber',
                                images: {
                                    $arrayElemAt: ['$images', 0] 
                                },
                                owner: '$owner'
                            }
                        }
                    }],
                    as: 'house',
                }
            },
            {$unwind: '$house'},
            {$addFields: {
                    "house.images": "$house.images.url"
                }
            },
            {$match: {
                    "house.owner": ownerId, 
                }
            },
            {$unwind: '$requests'},
            {$lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'requests.visitor',
                pipeline: [
                    {$project: {
                        password: 0,
                        isActive: 0,
                        role: 0
                    }}
                ],
                as: 'visitor'
            }},
            {$addFields: {
                fullname: {$concat: [{$first:'$visitor.firstname'}, ' ', {$first:'$visitor.lastname'}]}
            }},
            {$match: searchName},
            {$sort: {
                'requests.date': 1
            }},
            { $unwind: '$visitor' },
            {$group: {
                _id: '$house',
                requests: {$push: {
                    message: '$requests.message',
                    visitor: '$visitor._id',
                    fname: '$visitor.firstname',
                    lname: '$visitor.lastname',
                    request_id: '$requests._id',
                    date: '$requests.date',
                }},
            }},
            {$project: {
                house: '$_id',
                _id: 0,
                requests: 1
            }},
        ]);

        return res.status(200).json(requests);
    } catch (error) {
        next(error)
    }
}
