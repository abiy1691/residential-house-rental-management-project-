import mongoose from "mongoose";
import addressSchema from "./commons/Address.js";
import BankAccountSchema from "./commons/BankAccount.js";

const ownerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    national_id: { 
        type: {
            url: String,
            path: String
        },
        required: true,
    },
    bankAccounts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
    },});

ownerSchema.set('toJSON', {transform: (doc, ret, options) => {
    if (ret.national_id)
    ret.national_id = ret.national_id.url;
    return ret;
}});

export default mongoose.model("Owner", ownerSchema);
