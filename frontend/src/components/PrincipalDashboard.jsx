import React from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PrincipalDashboard = () => {
  const navigate = useNavigate();


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

  return (
    <Container component="main" maxWidth="md" sx={{ paddingTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Principal Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Manage Teachers and Students
        </Typography>
        <Box sx={{ width: '100%', mb: 3 }}>
          <List>
            <ListItem>
              <ListItemText primary="View Teachers" secondary="See and manage teacher information." />
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/view-teachers')}
              >
                View Teachers
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="View Students" secondary="See and manage student information." />
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/view-students')}
              >
                View Students
              </Button>
            </ListItem>
          </List>
        </Box>
        <Divider sx={{ width: '100%', mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Classrooms
        </Typography>
        <Box sx={{ width: '100%', mb: 3 }}>
          <List>
            <ListItem>
              <ListItemText primary="Create Classroom" secondary=" " />
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/create-classroom')}
              >
                Create Classroom
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/create-class')}
              >
                view all Classrooms
              </Button>
            </ListItem>
            
          </List>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default PrincipalDashboard;
