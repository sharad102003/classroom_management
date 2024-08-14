import jwt from "jsonwebtoken";
import { Principal } from "../src/models/principle.js";
import { Student } from "../src/models/student.js";
import { Teacher } from "../src/models/teacher.js";

export const verifyJWT = async (req, res, next) => {
    try {
        console.log("cookies:", req.cookies);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log("Token:", token); // Debugging line to check the token

        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token using your secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Determine the model based on the role in the token
        let model;
        switch (decodedToken.role) {
            case 'Principal':
                model = Principal;
                break;
            case 'Teacher':
                model = Teacher;
                break;
            case 'Student':
                model = Student;
                break;
            default:
                return res.status(400).json({ message: "Invalid role" });
        }
        

        // Find the user (principal, teacher, or student) using the ID in the token
        const user = await model.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        // Attach the user to the request object
        req.user = user;
     
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error during token verification:", error); // Log the error for debugging
        return res.status(401).json({ message: "Invalid token" });
    }
};
