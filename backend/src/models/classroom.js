import mongoose, { Schema } from 'mongoose';

const classroomSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
    }],
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    schedule: [{
      day: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      }
    }]
  }
);

export const Classroom = mongoose.model('Classroom', classroomSchema);
