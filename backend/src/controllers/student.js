import { Student } from "../models/student.js";
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const student = await Student.findById(userId);
        const accessToken = student.generateAccessToken();
        const refreshToken = student.generateRefreshToken();

        student.refreshToken = refreshToken;
        await student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error); // Log the error for debugging
        throw new Error("Something went wrong while generating refresh and access tokens");
    }
};



const registerStudent = async(req,res)=>{

    const{name, email, password} = req.body;
    console.log(req.body);

    if(!name || !email || !password)
    {
        return res.status(500).json({
            message: "all fields are required",
            success: "false",
        })
    }

    const student = await Student.create(
        {
            name,
            email,
            password
        }
    );

    const createdstudent = await Student.findById(student._id).select({email,name});
    if(createdstudent)
    {
        res.status(200).json(
            createdstudent
        )
    }
    else
    {
        res.status(500).json({
            message: "student not registered",
            success: "false"
        }) 
    }

};
const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        });
    }

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({
                message: "Student not found",
                success: false,
            });
        }

        const isPasswordValid = await student.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Wrong password",
                success: false,
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(student._id);
        const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken");

         const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'None', // Set to 'None' for cross-site requests
        };

        res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                message: "Student logged in successfully",
                student: loggedInStudent,
            });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "Login failed",
            success: false,
        });
    }
};

const logoutStudent = async (req,res)=>{
   

    await Student.findByIdAndUpdate(
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
        { message:"Student logged Out"}
    )

}
const allStudent = async (req,res) =>{

    try {const student = await Student.find();
    res
    .status(200)
    .json({
        student
    })}
    catch(error)
    {
        res.status(200).json({message:"failed to fetch students"})
    }
}

const editStudent = async (req,res)=>{

    const {name, email, password} = req.body;
    const{studentId} = req.params;
    // const findTeacher = await Teacher.find({name});
    // if(findTeacher)
    // {
    //     return res.
    //     status(500)
    //     .json({
    //         message: "this name teacher already exists"
    //     })
    // }

    const student = await Student.findById(studentId)
    student.name = name,
    student.email = email,
    student.password = password,

    await student.save();
    if(!student)
    {
        return res.
        status(500)
        .json({
            message: "Unable to update student details"
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

const deleteStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      // Corrected: Using the Student model instead of Teacher
      const deletedStudent = await Student.findByIdAndDelete(studentId);
  
      if (!deletedStudent) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
  
      return res.status(200).json({
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      return res.status(500).json({
        message: "Unable to delete the student",
      });
    }
  };

  const getStudent = async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const student = await Student.findById(studentId);
      if (student) {
        return res.status(200).json({
          message: "Student fetched successfully",
          student,
        });
      } else {
        return res.status(404).json({
          message: "Student not found",
        });
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      return res.status(500).json({
        message: "Error fetching student",
      });
    }
  };
  
  


export {registerStudent, loginStudent, logoutStudent, deleteStudent, allStudent, editStudent, getStudent};
