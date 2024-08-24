import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },

  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  
  date: { type: Date, required: true }, 
  
  status: { type: String, enum: ['Present', 'Absent'], required: true }, 
});

export const Attendence = mongoose.model('Attendence', attendanceSchema);
