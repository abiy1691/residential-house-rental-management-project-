import mongoose from "mongoose";

const BankAccountSchema = mongoose.Schema({
    bankname: String,
    accountnumber: String
});

export default BankAccountSchema