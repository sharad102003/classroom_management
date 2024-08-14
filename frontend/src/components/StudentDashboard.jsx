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
  CircularProgress,
} from '@mui/material';

const StudentDashboard = () => {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classroom or student data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, []);

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
        {classroom && (
          <>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Classroom: {classroom.name}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Teacher Name: {classroom.teacher.name}
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
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
          </>
        )}
      </Paper>
    </Container>
  );
};

export default StudentDashboard;
