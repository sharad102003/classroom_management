import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: '', email: '', password: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/allStudents`);
      
      setStudents(response.data.student); 
    } catch (error) {
      console.error('Failed to fetch students', error);
      setStudents([]); 
    }
  };

  const handleClickOpen = (student = { name: '', email: '', password: '' }) => {
    setCurrentStudent(student);
    setEditing(student.name ? true : false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentStudent({
      ...currentStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (editing) {
      // Edit student
      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/updateStudents/${currentStudent._id}`, currentStudent);
        fetchStudents();
        handleClose();
      } catch (error) {
        console.error('Failed to update student', error);
      }
    } else {
      // Create student
      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register/student`, currentStudent);
        fetchStudents();
        handleClose();
      } catch (error) {
        console.error('Failed to create student', error);
      }
    }
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/deleteStudents/${studentId}`);
      fetchStudents();
    } catch (error) {
      console.error('Failed to delete student', error);
    }
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Add Student
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students && students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No students found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            value={currentStudent.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            value={currentStudent.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            value={currentStudent.password}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewStudents;
