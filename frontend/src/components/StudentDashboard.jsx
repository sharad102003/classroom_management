import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Button,
} from '@mui/material';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]); // State for assignments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendancePercentage, setAttendancePercentage] = useState(null);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getclassStudent`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });

        setClassroom(response.data.classroom);
        setStudents(response.data.students);

        // Fetch the student's attendance percentage
        const attendanceResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAttendece`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });
        setAttendancePercentage(attendanceResponse.data.attendancePercentage);

        // Fetch assignments for the student
        const assignmentsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getassignmentsbyStudent`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });
        setAssignments(assignmentsResponse.data.assignments);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout/principal`, {}, {
        withCredentials: true,
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center">
          Student Dashboard
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginBottom: 2 }}>
          Logout
        </Button>
        {classroom && (
          <>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Classroom: {classroom.name}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Teacher Name: {classroom.teacher.name}
            </Typography>

            {attendancePercentage !== null ? (
              <Typography variant="h6" sx={{ marginTop: 2, color: 'green' }}>
                Attendance: {attendancePercentage.toFixed(2)}%
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ marginTop: 2, color: 'red' }}>
                Attendance data not available.
              </Typography>
            )}

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Your Classmates</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No other students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Display Assignments */}
            <Typography variant="h6" sx={{ marginTop: 4 }}>
              Assignments
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <TableRow key={assignment._id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.description}</TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
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
          </>
        )}
      </Paper>
    </Container>
  );
};

export default StudentDashboard;
