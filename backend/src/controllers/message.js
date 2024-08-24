import Message from '../models/message.js';

// Save a new message to the database
const saveMessage = async (req, res) => {
  try {
    const { room, text } = req.body;
    const sender = req.user._id;  // Assuming you're using JWT to extract user ID

    // Create and save the message
    const message = await Message.create({
      room,
      sender,
      text,
    });

    // Send the created message back to the client
    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

// Fetch all messages for a specific room
const getMessagesForRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Find all messages for the given room
    const messages = await Message.find({ room: roomId }).populate('sender', 'name');  // Assuming sender is populated

    // Return the messages to the client
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

export { saveMessage, getMessagesForRoom };
