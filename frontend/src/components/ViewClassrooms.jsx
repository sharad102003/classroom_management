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
} from '@mui/material';

const ViewClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all classrooms from the API
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getallClass`);
        console.log(response.data);
        setClassrooms(response.data.classroom || []); // Set classrooms to an empty array if undefined
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        setError('Failed to fetch classrooms. Please try again later.');
      }
    };
    fetchClassrooms();
  }, []);

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center">View Classrooms</Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Classroom Name</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Schedule</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classrooms.length > 0 ? (
                classrooms.map((classroom) => (
                  <TableRow key={classroom._id}>
                    <TableCell>{classroom.name || 'N/A'}</TableCell>
                    <TableCell>{classroom.teacher?.name || 'No teacher assigned'}</TableCell>
                    <TableCell>
                      {classroom.students && classroom.students.length > 0 ? (
                        <ul>
                          {classroom.students.map((student) => (
                            <li key={student._id}>{student.name}</li>
                          ))}
                        </ul>
                      ) : (
                        'No students assigned'
                      )}
                    </TableCell>
                    <TableCell>
                      {classroom.schedule && classroom.schedule.length > 0 ? (
                        <ul>
                          {classroom.schedule.map((scheduleItem, index) => (
                            <li key={index}>
                              {scheduleItem.day}: {scheduleItem.startTime} - {scheduleItem.endTime}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'No schedule available'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No classrooms found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ViewClassrooms;
