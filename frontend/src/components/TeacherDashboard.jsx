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
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState('');

  // States for assignment
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  // State to hold assignments
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getteacherClass`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });

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

    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getassignments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });

        // Log the response to debug
        console.log('Assignments response:', response.data);

        setAssignments(response.data.assignments || []);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Failed to fetch assignments. Please try again later.');
      }
    };

    fetchClassroomData();
    fetchAssignments();
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

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout/teacher`, {}, {
        withCredentials: true,
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTakeAttendance = () => {
    navigate('/attendance');
  };

  const chatbox = () => {
    navigate('/chat-box');
  };

  const handleOpenAssignmentDialog = () => {
    setOpenAssignmentDialog(true);
  };

  const handleCloseAssignmentDialog = () => {
    setOpenAssignmentDialog(false);
    setAssignmentDetails({
      title: '',
      description: '',
      dueDate: '',
    });
  };

  const handleAssignmentChange = (e) => {
    setAssignmentDetails({ ...assignmentDetails, [e.target.name]: e.target.value });
  };

  const handleIssueAssignment = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/assignments`, assignmentDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true,
      });
  
      // Refresh the page to reflect the newly created assignment
      window.location.reload();
    } catch (error) {
      console.error('Error issuing assignment:', error);
      setError('Failed to issue assignment. Please try again later.');
    }
  };
  

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center">
          Logged in Teacher Classroom
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginBottom: 2 }}>
          Logout
        </Button>

        {/* Take Attendance Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleTakeAttendance}
          sx={{ marginBottom: 2, marginLeft: 2 }}
        >
          Take Attendance
        </Button>

      

        {/* Issue Assignment Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAssignmentDialog}
          sx={{ marginBottom: 2, marginLeft: 2 }}
        >
          Issue Assignment
        </Button>

        {/* Students Table */}
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Update/Delete</TableCell>
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

        {/* Assignments Table */}
        <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
          <Typography variant="h6" align="center">
            All Assignments
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(assignments) && assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <TableRow key={assignment?._id}>
                      <TableCell>{assignment?.title || 'No Title'}</TableCell>
                      <TableCell>{assignment?.description || 'No Description'}</TableCell>
                      <TableCell>{assignment?.dueDate || 'No Due Date'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No assignments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Paper>

      {/* Edit Student Dialog */}
      {selectedStudent && (
        <Dialog open={openEditDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              name="name"
              value={selectedStudent?.name || ''}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={selectedStudent?.email || ''}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleUpdateStudent}>Update</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Assignment Dialog */}
      <Dialog open={openAssignmentDialog} onClose={handleCloseAssignmentDialog}>
        <DialogTitle>Issue Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={assignmentDetails.title || ''}
            onChange={handleAssignmentChange}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={assignmentDetails.description || ''}
            onChange={handleAssignmentChange}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            name="dueDate"
            value={assignmentDetails.dueDate || ''}
            onChange={handleAssignmentChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignmentDialog}>Cancel</Button>
          <Button onClick={handleIssueAssignment}>Issue</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherDashboard;
