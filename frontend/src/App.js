import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import CreateClassroom from './components/CreateClassroom';
import UnifiedLogin from './components/Login'; 
import PrincipalDashboard from './components/PrincipalDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ViewClassrooms from './components/ViewClassrooms';
import ViewStudents from './components/ViewStudents';
import ViewTeachers from './components/ViewTeachers';
import TeacherAttendance from './components/AttendenceDashboard';
import Chatbox from './components/Chat';

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
        <Route path="/attendance" element={<TeacherAttendance />} />
        <Route path="/chat-box" element={<Chatbox/>} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
