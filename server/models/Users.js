import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    aadhaar : { type: String, required: true, unique: true },
    username : { type: String, required: false, unique: true, sparse:true },
    phone : { type: String, required: false, unique: false, sparse:true },
    email : { type: String, required: false, unique: true, sparse:true },
    dob : { type: String, required: false, unique: false, sparse:true },
    district : { type: String, required: false, unique: false, sparse:true },
    subDistrict : { type: String, required: false, unique: false, sparse:true },
    category : { type: String, required: false, unique: false, sparse:true },
    subCategory : { type: String, required: false, unique: false, sparse:true },
    role : { type: String, required: false, unique: false, sparse:true },
    password : { type: String, required: false, unique: false, sparse:true },
    accountVerified : {type : Boolean, required: true, default: false},
    phoneVerified : {type : Boolean, required: true, default: false},
    emailVerified : {type : Boolean, required: true, default: false},
});

export const userModel = mongoose.model("users", UserSchema );
