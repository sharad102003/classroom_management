import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState({ name: '', email: '', password: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/allTeachers`);
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Failed to fetch teachers', error);
    }
  };

  const handleClickOpen = (teacher = { name: '', email: '', password: '' }) => {
    setCurrentTeacher(teacher);
    setEditing(teacher.name ? true : false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentTeacher({
      ...currentTeacher,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (editing) {
      // Edit teacher
      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/updateTeachers/${currentTeacher._id}`, currentTeacher);
        fetchTeachers();
        handleClose();
      } catch (error) {
        console.error('Failed to update teacher', error);
      }
    } else {
      // Create teacher
      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register/teacher`, currentTeacher);
        fetchTeachers();
        handleClose();
      } catch (error) {
        console.error('Failed to create teacher', error);
      }
    }
  };

  const handleDelete = async (teacherId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/deleteTeachers/${teacherId}`);
      fetchTeachers();
    } catch (error) {
      console.error('Failed to delete teacher', error);
    }
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Add Teacher
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
          {teachers.map((teacher) => (
            <TableRow key={teacher._id}>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleClickOpen(teacher)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(teacher._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            value={currentTeacher.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            value={currentTeacher.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            value={currentTeacher.password}
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

export default ViewTeachers;
