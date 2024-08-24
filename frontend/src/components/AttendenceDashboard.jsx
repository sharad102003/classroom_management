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
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Navigate } from 'react-router-dom';

const TeacherAttendance = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classroomId, setClassroomId] = useState(null);  
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getteacherClass`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });

        const classroomData = response.data.classrooms[0];
        setClassroomId(classroomData._id);  
        setStudents(classroomData.students);

        const initialAttendance = {};
        classroomData.students.forEach(student => {
          initialAttendance[student._id] = false;
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students.');
      }
    };

    fetchStudents();
  }, []);

  const handleToggleChange = (studentId) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: !prevAttendance[studentId], 
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!classroomId) {
      setError('Classroom ID is not available.');
      return;
    }

    try {
      await Promise.all(
        students.map(student => {
          const attendanceStatus = attendance[student._id] ? 'Present' : 'Absent';
          return axios.post(`${process.env.REACT_APP_API_BASE_URL}/markAttendence`, {
            studentId: student._id,
            classroomId,
            status: attendanceStatus,
            date: new Date(),
          });
        })
      );
      setIsSubmitted(true);
      
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setError('Failed to submit attendance.');
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center">
          Mark Attendance
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
                <TableCell>Attendance (Present/Absent)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map(student => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={attendance[student._id]} // true if present, false if absent
                          onChange={() => handleToggleChange(student._id)}
                          color="primary"
                        />
                      }
                      label={attendance[student._id] ? 'Present' : 'Absent'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitAttendance}
          sx={{ marginTop: 2 }}
          disabled={isSubmitted}  // Disable button after submission
        >
          {isSubmitted ? 'Attendance Submitted' : 'Submit Attendance'}
        </Button>
      </Paper>
    </Container>
  );
};

export default TeacherAttendance;
