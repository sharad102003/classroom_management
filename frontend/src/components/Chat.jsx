import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Button, TextField, Paper, List, ListItem, Typography } from '@mui/material';

const Chatbox = () => {
  const { roomId } = useParams();  // Assuming you pass roomId via route params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const currentUser = localStorage.getItem('userId'); // Assuming userId is saved in localStorage after login

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io('http://localhost:4000', {
      withCredentials: true,
    });
    setSocket(socketInstance);

    // Join the chat room
    socketInstance.emit('joinRoom', { roomId });

    // Listen for incoming messages
    socketInstance.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  // Fetch previous messages for the room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setMessages(response.data.getmessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      room: roomId,
      sender: currentUser,
      text: newMessage,
    };

    socket.emit('sendMessage', messageData);

    setNewMessage('');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Chat Room: {roomId}
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <List>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ListItem key={index}>
                <Typography>
                  <strong>{message.sender}</strong>: {message.text}
                </Typography>
              </ListItem>
            ))
          ) : (
            <Typography>No messages yet.</Typography>
          )}
        </List>
      </Paper>
      <div>
        <TextField
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here"
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send Message
        </Button>
      </div>
    </div>
  );
};

export default Chatbox;
