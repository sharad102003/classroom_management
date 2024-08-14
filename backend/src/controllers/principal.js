import { Principal } from "../models/principle.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const principal = await Principal.findById(userId)
        const accessToken = principal.generateAccessToken()
        const refreshToken = principal.generateRefreshToken()

        principal.refreshToken = refreshToken
        await principal.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerPrincipal = async (req, res) => {
  
    const { email, name, password } = req.body;

    try {
        // Check if the principal already exists
        const existPrincipal = await Principal.findOne({ email });
        if (existPrincipal) {
            return res.status(400).json({
                success: false,
                message: 'The email already exists.',
            });
        }

        // Create a new principal
        const principal = await Principal.create({
            email,
            password,
            name,
        });

        // Fetch the created principal to return it
        const createdPrincipal = await Principal.findById(principal._id);
        if (createdPrincipal) {
            return res.status(201).json({
                success: true,
                data: createdPrincipal,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'User is not created.',
            });
        }
    } catch (err) {
        // Handle any other errors
        return res.status(500).json({
            success: false,
            message: err.message || 'Server error',
        });
    }
};

const loginPrincipal = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        });
    }

    try {
        // Find the principal by name
        const principal = await Principal.findOne({ email });
        
        // Check if principal exists
        if (!principal) {
            return res.status(404).json({
                message: "Principal not found",
                success: false,
            });
        }

        // Check if the password is correct
        const isPasswordValid = await principal.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Wrong password",
                success: false,
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(principal._id);
        
        // Fetch the principal without sensitive fields
        const loggedinPrincipal = await Principal.findById(principal._id).select("-password -refreshToken");

        // Set cookies
         const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None', 
        };

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                message: "Principal logged in successfully",
                loggedinPrincipal,
                success: true,
            });
    } catch (err) {
        // Handle any other errors
        return res.status(500).json({
            success: false,
            message: err.message || 'Server error',
        });
    }
};


const logout = async (req,res)=>{
   

    await Principal.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(
        { message:"User logged Out"}
    )

}
export { registerPrincipal,loginPrincipal ,logout };
