import mongoose from "mongoose";

const ContractSchema = mongoose.Schema({
    startdate: Date,
    photo: {
        url: String,
        path: String,
    },
});

export default ContractSchema;
