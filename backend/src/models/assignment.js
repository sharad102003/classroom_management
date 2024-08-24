import mongoose, { Schema } from 'mongoose';

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Assignment = mongoose.model('Assignment', assignmentSchema);

