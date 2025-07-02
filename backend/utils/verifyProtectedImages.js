import mongoose from "mongoose";
import House from "../models/House.js";
import Owner from "../models/Owner.js";
import Tenant from "../models/Tenant.js";
import { createError } from "./CreateError.js";
import Payment from "../models/Payment.js";

export const verifyContract = async (req, res, next) => {
    try {
        req.originalUrl = req.originalUrl.slice(1)
        if (req.role === 'tenant') {
            const house = await House.findOne({tenant: req.user, 'contract.photo.url': req.originalUrl});
            
            if (!house)
                throw createError(400, 'Contract photo not found!');
    
            next()
            return
        }
    
        if (req.role === 'owner') {
            const house = await House.findOne({owner: req.user, 'occupancy_history.contract_photo.url': req.originalUrl});

            if (!house)
                throw createError(400, 'Contract photo not found!')
            
            next()
            return
        }
        next()
    } catch (error) {
        next(error)
    }
}

export const verifyNationalId = async (req, res, next) => {
    try {
        req.originalUrl = req.originalUrl.slice(1)
        if (req.role === 'tenant') {
            const house = await House.findOne({tenant: req.user})
            
            if (!house)
                throw createError(400, 'Contract photo not found!');
    
            const tenant = await Tenant.findOne({user: req.user, 'national_id.url': req.originalUrl});
            if (tenant) {
                next()
                return
            }
            const owner = await Owner.findOne({user: house.owner, 'national_id.url': req.originalUrl})
            if (owner) {
                next()
                return
            }
            throw createError(400, "National id image not found")
        }
    
        if (req.role === 'owner') {
            req.user = new mongoose.Types.ObjectId(req.user);

            const owner = await Owner.findOne({
                'national_id.url': req.originalUrl, user: req.user, 
                user: req.user,
            });
            if (owner) {
                next()
                return
            }
            
            const tenant = await Tenant.findOne({'national_id.url': req.originalUrl});
            const house = await House.findOne({'occupancy_history.tenant': tenant.user, owner: req.user});
            if (house) {
                next()
                return
            }

            throw createError(400, 'Contract photo not found!')
        }
        next()
    } catch (error) {
        next(error)
    }
}

export const verifyPaymentVerification = async (req, res, next) => {
    try {
        req.originalUrl = req.originalUrl.slice(1)
        if (req.role === 'tenant') {
            const payment = await Payment.findOne({tenant_id: req.user, 'verification.url':req.originalUrl});
            if (!payment)
                throw createError(400, 'Payment not found')
            next()
            return
        }
        if (req.role === 'owner') {
            const payment = await Payment.findOne({'verification.url': req.originalUrl});
            if (!payment)
                throw createError(400, 'Payment not found')

            const owner = await House.findOne({'occupancy_history.tenant': payment.tenant_id, owner: req.user});
            if (!owner)
                throw createError(400, 'Payment not found')
            next()
            return
        }
        next()
    } catch (error) {
        next(error)   
    }
} 
