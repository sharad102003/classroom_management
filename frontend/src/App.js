import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import for BrowserRouter
import CreateClassroom from './components/CreateClassroom';
import UnifiedLogin from './components/Login'; // Ensure this path matches your file structure
import PrincipalDashboard from './components/PrincipalDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ViewClassrooms from './components/ViewClassrooms';
import ViewStudents from './components/ViewStudents';
import ViewTeachers from './components/ViewTeachers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UnifiedLogin />} />
        <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
        <Route path="/create-classroom" element={<CreateClassroom/>} />
        <Route path="/view-teachers" element={<ViewTeachers/>} />
        <Route path="/view-students" element={<ViewStudents/>} />
        <Route path="/create-class" element={<ViewClassrooms/>} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
