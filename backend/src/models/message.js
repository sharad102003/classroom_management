import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: {
    type: String,  // Room or classroom the message belongs to
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,  // User who sent the message (student/teacher)
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
