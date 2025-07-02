import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: [true, "First name is required"]
    },
    username:{
        type:String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    lastname:{
        type:String,
        required:true
    },
    phonenumber:{
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        validate: {
            validator: phone => {
                const checker = /^\+(2519|2517)\d{8}$/;
                return checker.test(phone);
            },
            message: 'Phone number format doesn\'t match'
        }
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique: [true, "Email already exists"],
        validate: {
            validator: email => {
                const checker = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return checker.test(email);
            },
            message: 'Incorrect email format!'
        },
        lowercase: true
    },
    password:{
        type:String,
        minlength: 6,
        required:true
    },
    role:{
        type:String,
        default:"user",
        enum: ['user', 'admin', 'owner', 'tenant']
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    verified: {
        type: Boolean,
        default: true,
    }
});

userSchema.pre('save', function (next) {
    const random = Math.floor(Math.random() * 10000);
    if (!this.username)
        this.username = this.email.split('@')[0] + random
    next()
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model("User",userSchema);
export default User;