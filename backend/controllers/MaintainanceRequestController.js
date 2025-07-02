import mongoose from "mongoose";
import House from "../models/House.js";
import Maintenance from "../models/Maintenance.js";
import { createError } from "../utils/CreateError.js";

export const createMaintainance = async(req,res,next)=>{
    const {description} = req.body;
     try {
        const tenantid = req.user;
        const house = await House.findOne({tenant: tenantid}).select('_id')

        const maintainace = new Maintenance({
            house_id: house._id,
            tenant_id: tenantid,
            description:description
        })
        
        const savedMaintainance = await maintainace.save();
    
        return res.status(201).json(savedMaintainance)
     } catch (error) {
        next(error)
     }
}

export const getMaintenanceRequest = async(req,res,next) =>{
    try {
        const ownerId = new mongoose.Types.ObjectId(req.user);
        
        const maintenanceRequests = await Maintenance.aggregate([
            {
                $group: {
                    _id: "$house_id",
                    requests: {$push: "$$ROOT"}
                }
            },
            {
                $project: {
                    'requests.house_id': 0,
                }
            },
            {
                $lookup: {
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
                                owner: '$owner',
                            }
                        }
                    }],
                    as: 'house',
                }
            },
            {
                $unwind: '$house'
            },
            {
                $addFields: {
                    "house.images": "$house.images.url"
                }
            },
            {
                $match: {
                    "house.owner": ownerId, 
                }
            },
            {
                $unwind: '$requests'
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'requests.tenant_id',
                    pipeline: [
                        {
                            $project: {
                                password: 0,
                                isActive: 0,
                                role: 0
                            }
                        }
                    ],
                    as: 'tenant'
                }
            },
            {
                $sort: {
                    'requests.updatedAt': -1
                }
            },
            {
                $unwind: '$tenant'
            },
            {
                $group: {
                    _id: '$house',
                    requests: {$push: {
                        status: '$requests.status',
                        description: '$requests.description',
                        createdAt: '$requests.createdAt',
                        updatedAt: '$requests.updatedAt',
                        tenantid: '$tenant._id',
                        fname: '$tenant.firstname',
                        lname: '$tenant.lastname',
                        request_id: '$requests._id'
                    }}
                }
            },
            {
                $project: {
                    house: '$_id',
                    _id: 0,
                    requests: 1
                }
            },
        ]);
        
        res.status(200).json(maintenanceRequests)
    } catch (error) {
        next(error);
    }
}

export const editRequest = async (req, res, next) => {
    try {
        const {description} = req.body;
        const request = await Maintenance.findOne({_id: req.params.requestid, tenant_id: req.user});
        if (!request)
            throw createError(400, "Request not found")
        
        request.description = description || request.description;
        await request.save()
        return res.status(200).json({msg: 'Successfully updated'})
    } catch (error) {
        next(error)
    }
}

// Not effecient
export const changeStatus = async (req, res, next) => {
    try {
        if(req.role === 'tenant') {
            const request = await Maintenance.findOne({_id: req.params.requestid, tenant_id: req.user});
            request.status = false;
            await request.save();
            return res.status(200).json({msg: "Successfully updated status", id: request._id})
        }
        let houses = await House.find({owner: req.user}).select('_id');
        houses = houses.map(({_id})=>_id.toString());
        
        const request = await Maintenance.findOne({_id: req.params.requestid, house_id: {$in: houses}});
        request.status = true;
        
        await request.save();
        return res.status(200).json({msg: "Successfully updated status", id: request._id})
    } catch (error) {
        next(error)
    }
}

export const tenantRequests = async (req, res, next) => {
    try {
        const requests = await Maintenance.find({tenant_id: req.user}).select('createdAt status description updatedAt');


        return res.status(200).json(requests)
    } catch (error) {
        next(error)
    }
} 

export const deleteRequest = async (req, res, next) => {
    try {
        const request = await Maintenance.deleteOne({_id: req.params.requestid, tenant_id: req.user});
        return res.status(200).json(request)
    } catch (error) {
        next(error)
    }
}

export const getAllMaintenanceRequests = async(req,res,next) =>{
    try {
         const allRequest = await Maintenance.find();
         if(!allRequest) createError(404,'there is no maintenance request')
        
        return res.status(200).json(allRequest);
    } catch (error) {
        createError(500,'server error')
    }
}