import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateClassroom = () => {
  const [classroomName, setClassroomName] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available teachers and students from the API
    const fetchData = async () => {
      try {
        const [teachersResponse, studentsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/allTeachers`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/allStudents`)
        ]);
        setAvailableTeachers(teachersResponse.data.teachers);
        setAvailableStudents(studentsResponse.data.student);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/createClassroom`, {
        name: classroomName,
        teacher: assignedTeacher,
        students: selectedStudents,
        schedule
      });

      if (response.status === 201) {
        navigate('/principal-dashboard'); // Redirect to dashboard on success
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
      setError('Failed to create classroom. Please try again.');
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((scheduleItem) =>
        scheduleItem.day === day ? { ...scheduleItem, [field]: value } : scheduleItem
      )
    );
  };

  const handleAddDayToSchedule = (day) => {
    setSchedule((prevSchedule) => [...prevSchedule, { day, startTime: '', endTime: '' }]);
  };

  const handleRemoveDayFromSchedule = (day) => {
    setSchedule((prevSchedule) => prevSchedule.filter((scheduleItem) => scheduleItem.day !== day));
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Create Classroom</Typography>
        {error && <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>{error}</Typography>}
        <Box component="form" onSubmit={handleCreateClassroom} sx={{ mt: 3 }}>
          <TextField
            label="Classroom Name"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="teacher-label">Assign Teacher</InputLabel>
            <Select
              labelId="teacher-label"
              value={assignedTeacher}
              onChange={(e) => setAssignedTeacher(e.target.value)}
            >
              {availableTeachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
              ))}
            </Select>
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="students-label">Assign Students</InputLabel>
            <Select
              labelId="students-label"
              multiple
              value={selectedStudents}
              onChange={(e) => setSelectedStudents(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableStudents.map((student) => (
                <MenuItem key={student._id} value={student._id}>{student.name}</MenuItem>
              ))}
            </Select>
           
          </FormControl>
          <Typography variant="h6" sx={{ mt: 3 }}>Classroom Schedule</Typography>
          {daysOfWeek.map((day) => (
            <Box key={day} sx={{ mt: 2 }}>
              {schedule.some((item) => item.day === day) ? (
                <>
                  <Typography variant="body1" sx={{ mt: 2 }}>{day}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={schedule.find((item) => item.day === day)?.startTime || ''}
                        onChange={(e) => handleScheduleChange(day, 'startTime', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label="End Time"
                        type="time"
                        value={schedule.find((item) => item.day === day)?.endTime || ''}
                        onChange={(e) => handleScheduleChange(day, 'endTime', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button color="secondary" onClick={() => handleRemoveDayFromSchedule(day)}>Remove</Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Button variant="outlined" onClick={() => handleAddDayToSchedule(day)}>
                  Add {day}
                </Button>
              )}
            </Box>
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Classroom
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateClassroom;
