import mongoose from "mongoose";
import addressSchema from "./commons/Address.js";
import { removeImage } from "../utils/fileProcessing.js";

export const tenantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  mother_name: {
    type: String,
  },
  reference: {
    type: {
      name: {
        type: String, 
        required: [true, "Reference full name is required"]
      },
      phonenumber:{
        type: String,
        required: [true, "Reference phone number is required"],
        validate: {
            validator: phone => {
                const checker = /^\+(2519|2517)\d{8}$/;
                return checker.test(phone);
            },
            message: 'Phone number format doesn\'t match'
        }
    },
    address: addressSchema
    },
    required: true
  },
  national_id: {
    type: {
      url: String,
      path: String,
    },
    required: true,
  },
});

tenantSchema.set('toJSON', {transform: (doc, ret, options) => {
  ret.national_id = ret.national_id.url;
  return ret
}});

tenantSchema.pre('deleteMany', {document: true, query: true}, async function(next) {
  const tenants = await this.model.find(this.getQuery())
  for (let index = 0; index < tenants.length; index++) {
    await removeImage(tenants[index].national_id.path)
  }
  next()
})

export default mongoose.model("Tenant", tenantSchema);
