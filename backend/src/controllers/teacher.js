import { Teacher } from "../models/teacher.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const teacher = await Teacher.findById(userId)
        const accessToken = teacher.generateAccessToken()
        const refreshToken = teacher.generateRefreshToken()

        teacher.refreshToken = refreshToken
        await teacher.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerTeacher = async(req,res)=>{

    const{name, email, password} = req.body;
    console.log(req.body);

    if(!name || !email || !password)
    {
        return res.status(500).json({
            message: "all fields are required",
            success: "false",
        })
    }

    const teacher = await Teacher.create(
        {
            name,
            email,
            password
        }
    );

    const createdteacher = await Teacher.findById(teacher._id).select({email,name});
    if(createdteacher)
    {
        res.status(200).json(
            createdteacher
        )
    }
    else
    {
        res.status(500).json({
            message: "teacher not registered",
            success: "false"
        }) 
    }

};

const loginTeacher = async (req,res)=>{
    

    const {email, password}  = req.body;

    if(!email || !password)
    {
        return res.status(500).json({
            message: "all fields are required",
            success: "false",
        })
    }
    const teacher = await Teacher.findOne({email});
    const isPasswordValid = await teacher.isPasswordCorrect(password);
    if(!isPasswordValid)
    {
        res.status(400).json({
            message: "wrong password"
        })
    }
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(teacher._id);
    const loggedinTeacher = await Teacher.findById(teacher._id).select("-password -refreshToken")

     const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'None', // Set to 'None' for cross-site requests
        };
    
      res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .status(200)
        .json(
            {
                message:"teacher logged in successfully",
                loggedinTeacher
            }
          
        );


}

const logoutTeacher = async (req,res)=>{
   

    await Teacher.findByIdAndUpdate(
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

const allTeachers = async (req,res) =>{

    try {const teachers = await Teacher.find();
    res
    .status(200)
    .json({
         teachers
    })}
    catch(error)
    {
        res.status(200).json({message:"failed to fetch teachers"})
    }
}

const editTeacher = async (req,res)=>{

    const {name, email, password} = req.body;
    const{teacherId} = req.params;
    const existingTeacher = await Teacher.findOne({ name, _id: { $ne: teacherId } });
    if (existingTeacher) {
      return res.status(400).json({
        message: "A teacher with this name already exists",
      });
    }

    const teacher = await Teacher.findById(teacherId)
    teacher.name = name,
    teacher.email = email,
    teacher.password = password,

    await teacher.save();
    if(!teacher)
    {
        return res.
        status(500)
        .json({
            message: "Unable to update teacher details"
        })
    }
    else
    {
       return  res
        .status(201)
        .json({
            message: "details updated successfully"
        })
    }

}

const deleteTeacher = async (req, res) => {
    try {
      const { teacherId } = req.params;
  
      // Delete the teacher by ID
      const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
  
      if (!deletedTeacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }
  
      return res.status(200).json({
        message: "Teacher deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting teacher:", error);
      return res.status(500).json({
        message: "Unable to delete the teacher",
      });
    }
  };
  

export {registerTeacher, loginTeacher, logoutTeacher , allTeachers, editTeacher, deleteTeacher};
