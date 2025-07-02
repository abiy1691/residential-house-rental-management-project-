import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    city:{
     type:String,
     required:true
    },
    kebele:{
     type:String,
    },
    sub_city:{
     type:String,
     required:true
    },
    woreda:{
     type:String,
    },
    latitude:{
     type:String,
    },
    longitude:{
     type:String,
    }
});

export default addressSchema;
 