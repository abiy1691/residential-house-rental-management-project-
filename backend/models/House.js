import mongoose, { get } from "mongoose";
import addressSchema from "./commons/Address.js";
import BankAccountSchema from "./commons/BankAccount.js";
import ContractSchema from "./commons/Contract.js";
import Maintenance from "./Maintenance.js";
import Requests from "./VisitorRequest.js";
import { removeImage } from "../utils/fileProcessing.js";
import User from "./User.js";
import Tenant from "./Tenant.js";
import historySchema from './History.js'
import Payment from "./Payment.js";

export const HouseTypes = ["apartment", "condo", "duplex", "house", "mansion", "penthouse", "shared apartment", "studio", "villa", "bedsitter", "chalet", "farm house", "room", "building"];

function timegetter(date) {
    return new Date(date);
}

export const houseSchema = new mongoose.Schema({
    housenumber: {
        type: Number,
        required: true,
        get: houseno => houseno < 10? '0'+houseno : houseno
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Owner',
    },
    tenant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
    },
    no_of_rooms:{
        type:Number,
        required:true
    },
    no_of_bath_rooms:{
        type:Number,
        required:true
    },
    width:{
        type:Number,
    },
    length:{
        type:Number, 
    },
    house_type:{
        type:String,
        enum: HouseTypes,
        lowercase: true,
        default: 'house'
    },
    address:{
        type:addressSchema
    },
    bankaccounts: [BankAccountSchema],
    rent_amount:{
        type:Number
    },
    deadline: {
        type:Date
    },
    images:[{
        url: String,
        path: String,
    }],
    contract: ContractSchema,
    description:{
        type:String
    },
    occupancy_history: [historySchema],
    calendar: {
        type: {
            open: Boolean,
            schedule: {
                type: [{
                    starttime: {
                        type: Date,
                        get: timegetter,
                    },
                    endtime: {
                        type: Date,
                        get: timegetter
                    }
                }],
                required: false
            }
        },
        default: v => {
            console.log('The default is run just when created', v);
            return ({open: false, schedule: Array(7).fill(null)});
        }
    },
}, {
    timestamps: true,
})

houseSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log('here')
    await Maintenance.deleteMany({house_id: this._id});
    await Payment.deleteMany({house_id: this._id});
    await Requests.deleteMany({house: this._id});
    
    const tenants = this.occupancy_history.map(({tenant}) => tenant);
    
    for (let index = 0; index < this.occupancy_history.length; index++) {
        const element = this.occupancy_history[index].contract_photo;
        console.log(element.path)
        await removeImage(element.path)
    }

    await Tenant.deleteMany({user: {$in: tenants}})
    await User.deleteMany({_id: {$in: tenants}});
    for (let index = 0; index < this.images.length; index++) {
        const element = this.images[index];
        await removeImage(element.path)
    }
    next()
});


houseSchema.pre('save', function(next) {
    // remove duplicate images ?
    const imageSet = new Set()
    this.images.forEach((image) => {
        imageSet.add(image.url)
    })

    this.images = [...imageSet]
    next();
});

houseSchema.set('toJSON', {transform: (doc, ret, options) => {
    if (ret.images && ret.images.length > 0)
        ret.images = ret.images.map(({url}) => url);
    if (ret.contract && ret.contract.photo)
        ret.contract.photo = ret.contract.photo.url;
    return ret
}});

houseSchema.index({ housenumber: 1, owner: 1 }, { unique: true });

const House = mongoose.model("House", houseSchema);
export default House 