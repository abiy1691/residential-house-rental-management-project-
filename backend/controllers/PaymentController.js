import House from "../models/House.js";
import Payment from "../models/Payment.js";
import { createError } from "../utils/CreateError.js";
import { removeImage } from "../utils/fileProcessing.js";

export const payRent = async (req, res, next) => {
    try {
        const house = await House.findOne({tenant: req.user});

        let {paid_to, month} = req.body;
        paid_to = JSON.parse(paid_to);
        
        if (!req.file)
            throw createError(400, 'Verificaiton photo is needed')
        
        const verification = {
            url: 'verifications/'+req.file.filename,
            path: req.file.destination+"/"+req.file.filename
        };
        
        if (!house)
            throw createError(400, 'House not found');

        const payment = await Payment.create({
            deadline: house.deadline,
            amount: house.rent_amount,
            house_id: house._id,
            tenant_id: req.user,
            paid_to: paid_to,
            month: month || 1,
            verification
        });
        
        return res.status(200).json(payment)
    } catch (error) {
        next(error)
    }
}

export const editPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment || payment.status === 'success')
            throw createError(400, 'Payment not found')
        let {paid_to, month} = req.body;
        paid_to = JSON.parse(paid_to);
        
        payment.paid_to = paid_to || payment.paid_to;
        payment.month = month || payment.month;

        let removedPath = ''
        if (req.file) {
            removedPath = payment.verification.path
            payment.verification = {
                url: 'verifications/'+req.file.filename,
                path: req.file.destination+"/"+req.file.filename
            };
        }

        await payment.save()
        
        if (removedPath !== '')
            await removeImage(removedPath)
        
        return res.status(200).json(payment);
    } catch (error) {
        next(error)
    }
}

export const verifyPayment = async (req, res, next) => {
    try {
        const house = await House.findOne({_id: req.params.houseid, owner: req.user});

        if (!house)
            throw createError(400, 'House not found');

        const payment = await Payment.findOne({_id: req.params.paymentid, house_id: house._id});
        if (!payment)
            throw createError(400, 'Wrong payment id');
        
        if (payment.status !== 'pending')
            return res.status(200).json('Already paid');
        
        if (!req.body.accept) {
            payment.status = 'failed'
            payment.save()
            return res.status(200).json('Successfully changed status');
        }

        payment.status = 'success';
        
        const old_deadline = new Date(house.deadline);
        old_deadline.setMonth(old_deadline.getMonth()+payment.month);
        house.deadline = old_deadline;
        await payment.save();
        await house.save();
    
        return res.status(200).json('Successfully verified payment');
    } catch (error) {
        next(error);
    }
}

export const tenantPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({tenant_id: req.user});
        return res.status(200).json(payments);
    } catch (error) {
        next(error)
    }
}

export const ownerPaymentHistory = async (req, res, next) => {
    try {
        let houses = await House.find({owner: req.user}).select('_id');
        houses = houses.map(({_id}) => _id);
        const payments = await Payment.aggregate([
            {$match:{
                house_id: {$in: houses}
            }},
            {$sort: {date: 1}},
            {$group: {
                _id: '$house_id',
                payments: {$push:{
                    amount: '$amount',
                    tenant: '$tenant_id',
                    status: '$status',
                    paid_to: '$paid_to',
                    date: '$date',
                    deadline: '$deadline',
                    verification: '$verification.url',
                    month: '$month',
                    _id: '$_id'
                }}
            }},
            {$lookup: {
                from: 'houses',
                localField: '_id',
                foreignField: '_id',
                pipeline: [{
                    $replaceRoot: {newRoot: {
                        houseno: '$housenumber',
                        id: '$_id'
                    }}
                }],
                as: 'house'
            }},
            {$unwind: '$house'},
            {$unwind: '$payments'},
            {$lookup: {
                from: 'users',
                localField: 'payments.tenant',
                foreignField: '_id',
                pipeline: [{
                    $replaceRoot: {newRoot: {
                        tenant: '$_id',
                        firstname: '$firstname',
                        lastname: '$lastname',
                        email: '$email',
                    }}
                }],
                as: 'tenant'
            }},
            {$unwind: '$tenant'},
            {$group: {
                _id: '$_id',
                house: {$first: '$house'},
                payments: {$push: {
                    amount: '$payments.amount',
                    date: '$payments.date',
                    status: '$payments.status',
                    paid_to: '$payments.paid_to',
                    deadline: '$payments.deadline',
                    verification: '$payments.verification',
                    month: '$payments.month',
                    tenant: '$tenant',
                    id: '$payments._id'
                }}
            }}
        ]);
        return res.status(200).json(payments)
    } catch (error) {
        next(error)
    }
}

export const paymentStats = async (req, res, next) => {
    try {
        let houses = await House.find({owner: req.user}).select('_id');
        houses = houses.map(({_id}) => _id);
        const payments = await Payment.aggregate([
            {$match:{
                house_id: {$in: houses}
            }},
            {$sort: {date: 1}},
            {$lookup: {
                from: 'houses',
                localField: 'house_id',
                foreignField: '_id',
                pipeline: [{
                    $replaceRoot: {newRoot: {
                        houseno: '$housenumber',
                        images: '$images.url',
                    }}
                }],
                as: 'house'
            }},
            {$lookup: {
                from: 'users',
                localField: 'tenant_id',
                foreignField: '_id',
                pipeline: [{
                    $replaceRoot: {newRoot: {
                        tenant: '$_id',
                        firstname: '$firstname',
                        lastname: '$lastname',
                        email: '$email',
                        isActive: '$isActive'
                    }}
                }],
                as: 'tenant'
            }},
            {$unwind: '$house'},
            {$unwind: '$tenant'},
            {$addFields: {
                month: {$dateTrunc: 
                    {
                        date: '$deadline',
                        unit: 'month'
                    }}
            }},
            {$group: {
                _id: '$month',
                total: {$sum: '$amount'},
                details: {$push: {
                    amount: '$amount',
                    house: '$house',
                    tenant: '$tenant',
                    paid_to: '$paid_to',
                    date: '$date',
                    deadline: '$deadline'
                }},
            }},
        ]);
        return res.status(200).json(payments);
    } catch (error) {
        next(error)
    }
}
