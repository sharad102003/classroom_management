
import {Assignment}  from '../models/assignment.js';
import { Classroom } from '../models/classroom.js';

// Create a new assignment
const createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const teacherId = req.user._id; 

  try {
    const newAssignment = await Assignment.create({
      title,
      description,
      dueDate,
      issuedBy: teacherId,
      
    });
    console.log(newAssignment);
    return res.status(201).json({
      newAssignment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to issue assignment',
      error: error.message
    });
  }
};

// Get assignments for a specific class
const getAssignmentsByTeacher = async (req, res) => {
    const teacherId = req.user._id; 

  try {
    const assignments = await Assignment.find({issuedBy : teacherId }).sort({ dueDate: -1 });

    res.status(200).json({
      success: true,
      assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};
const getAssignmentsByStudent = async (req, res) => {
    try {
        // Assuming `req.user` has the student ID
        const studentId = req.user._id;

        // Fetch the student's classroom to get the teacher's ID
        const classroom = await Classroom.findOne({ 'students': studentId });
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Classroom not found',
            });
        }

        const teacherId = classroom.teacher;
        console.log(teacherId);
        // Fetch assignments created by the teacher
        const assignments = await Assignment.find({ issuedBy : teacherId }).sort({ dueDate: -1 });

        res.status(200).json({
            success: true,
            assignments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assignments',
            error: error.message,
        });
    }
};

  

export {createAssignment, getAssignmentsByTeacher, getAssignmentsByStudent};