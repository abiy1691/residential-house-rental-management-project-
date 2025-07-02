import mongoose from "mongoose";
import BankAccount from './commons/BankAccount.js';

const PAYMENT_STATUS = ['pending', 'failed', 'success']

const paymentSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true,
        default: Date.now
    },
    deadline:{
        type:Date,
        required:true
    },
    amount: {
        type: Number,
        required: true,
    },
    paid_to:{
        type:BankAccount,
        required:true
    },
    house_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'House'
    },
    tenant_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
    },
    status: {
        type: String,
        enum: PAYMENT_STATUS,
        default: 'pending'
    },
    verification: {
        type: {
            url: String,
            path: String,
        },
        required: true,
    },
    month: {
        type: Number,
        default: 1
    }
});

paymentSchema.set('toJSON', {transform: (doc, ret, options) => {
    ret.verification = ret.verification.url;
    return ret
  }});
  
export default mongoose.model("Payment",paymentSchema)