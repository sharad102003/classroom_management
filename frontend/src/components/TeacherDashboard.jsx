import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TeacherDashboard = () => {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
   
    const fetchClassroomData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getteacherClass`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });

       
        console.log(response.data);

      
        const classroomData = response.data.classrooms[0]; 

        if (classroomData) {
          setClassroom(classroomData);
          
       
          setStudents(classroomData.students || []);
        } else {
          setClassroom(null);
          setStudents([]);
        }
      } catch (error) {
        console.error('Error fetching classroom or student data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };
    fetchClassroomData();
  }, []);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setSelectedStudent(null);
  };

  const handleChange = (e) => {
    setSelectedStudent({
      ...selectedStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/updateStudents/${selectedStudent._id}`, selectedStudent);
      setStudents((prev) =>
        prev.map((student) => (student._id === selectedStudent._id ? selectedStudent : student))
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student. Please try again later.');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/deleteStudents/${studentId}`);
      setStudents((prev) => prev.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again later.');
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center">
          logged in Teacher classroom
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>update/delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(student)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteStudent(student._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Student Dialog */}
      {selectedStudent && (
        <Dialog open={openEditDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              value={selectedStudent.name || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              value={selectedStudent.email || ''}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateStudent} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default TeacherDashboard;
