import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const principalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Ensure this is set
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    }
});

principalSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

principalSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

principalSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role: 'Principal',
            email: this.email,
            username: this.username,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
principalSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role: 'Principal'
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Principal = mongoose.model("Principal", principalSchema);

