import mongoose from "mongoose";
import addressSchema from "./commons/Address";
import BankAccountSchema from "./commons/BankAccount";

const HouseComplex = mongoose.Schema({
    housenumber: {
        type: String,
        required: true,
        unique: true,
    },
    oraganization: {
        type: String,
    },
    defaults: {
        type: {
            address: addressSchema,
            bankaccounts: [BankAccountSchema],
            rentamount: Number,
        },
    },
});

export default mongoose.model('Complex', HouseComplex);