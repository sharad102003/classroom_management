import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Container, Typography, Paper, Box } from '@mui/material';

const UnifiedLogin = () => {
  const [email, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('principal');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 
  

  const handleLogin = async () => {
    try {
      let endpoint = '';

      switch (role) {
        case 'principal':
          endpoint = '/login/principal';
          break;
        case 'teacher':
          endpoint = '/login/teacher';
          break;
        case 'student':
          endpoint = '/login/student';
          break;
        default:
          throw new Error('Invalid role selected');
      }

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, { email, password },
       { withCredentials: true });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log(response.data);

      switch (role) {
        case 'principal':
          navigate("/principal-dashboard");
          break;
        case 'teacher':
          navigate("/teacher-dashboard");
          break;
        case 'student':
          navigate("/student-dashboard");
          break;
        default:
          throw new Error('Invalid role selected');
      }
    } catch (error) {
      console.error('Login error:', error); 
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
        <Typography variant="h5">Login</Typography>
        {error && <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>{error}</Typography>}
        <Box component="form" sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="principal">Principal</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Name"
            value={email}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnifiedLogin;
