import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true
    },
    date:{
        type: Date,
    },
    message: String
});

requestSchema.index({ visitor: 1, house: 1 }, { unique: true });

const Requests = mongoose.model('Request', requestSchema);
export default Requests;