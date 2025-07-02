import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    refreshtoken: {
        reqiured: true,
        type: String,
        uinque: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        reqiured: true,
        ref: 'User',
    }
});

const Token =  mongoose.model('Token', TokenSchema);
export default Token;