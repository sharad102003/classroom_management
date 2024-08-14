import { Classroom } from '../models/classroom.js';

 const createClassroom = async (req, res) => {
  try {
    const { name, teacher, students, schedule } = req.body;

    // Ensure unique classroom name
    const existingClassroom = await Classroom.findOne({ name });
    if (existingClassroom) {
      return res.status(400).json({ message: 'Classroom name already exists' });
    }

    // Create new classroom
    const classroom = new Classroom({
      name,
      teacher,
      students,
      schedule
    });

    await classroom.save();

    return res.status(201).json({
      message: 'Classroom created successfully',
      classroom
    });
  } catch (error) {
    console.error('Error creating classroom:', error);
    return res.status(500).json({ message: 'Failed to create classroom' });
  }
};

const getallClass = async (req,res)=>{

    const classroom = await Classroom.find()
    .populate('teacher', 'name') 
    .populate('students', 'name');
    return res
    .json({
        classroom
    })
}

const getteacherClass = async (req, res) => {
    const teacherId = req.user._id;
    console.log('Teacher ID:', teacherId);

    try {
        // Fetch classrooms with populated teacher and student details
        const classrooms = await Classroom.find({ teacher: teacherId })
            .populate('teacher')
            .populate('students');

        if (classrooms.length > 0) {
            return res.status(200).json({ classrooms });
        } else {
            return res.status(404).json({ message: "No classrooms found for this teacher" });
        }
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        return res.status(500).json({ message: "Failed to fetch teacher's classrooms" });
    }
};

const getStudentClassroom = async (req, res) => {
    try {
      const studentId = req.user._id; 
      const classroom = await Classroom.findOne({ students: studentId }).populate('students').populate('teacher');
  
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found for this student' });
      }
  
      return res.json({
        classroom,
        students: classroom.students,
      });
    } catch (error) {
      console.error('Error fetching student classroom data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

export {getallClass, createClassroom, getteacherClass, getStudentClassroom}