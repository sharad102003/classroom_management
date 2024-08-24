
import {Attendence}  from '../models/attendence.js';

// Mark Attendance
const markAttendence =  async (req, res) => {
  const { classroomId,studentId,date, status } = req.body;
  

  try { 
    const attendance = new Attendence({ classroomId,studentId, date, status });
    await attendance.save();
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking attendance' });
  }
};

// Fetch Attendance by Classroom
const getAttendence = async (req, res) => {
    try {
      const studentId = req.user._id; 
      const attendanceRecordsAbsent = await Attendence.find({ studentId, status: 'Absent' });
      const attendanceRecordsPresent = await Attendence.find({ studentId, status: 'Present' });

      const totalClasses = attendanceRecordsAbsent.length + attendanceRecordsPresent.length;
      const attendedClasses = attendanceRecordsPresent.length;
  
      const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  
      // Return the attendance percentage
      res.status(200).json({ attendancePercentage });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching attendance' });
    }
  };
  
export {markAttendence, getAttendence};
