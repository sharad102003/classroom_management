import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';  // Importing http to work with socket.io
import { Server } from 'socket.io';  // Import Socket.IO

import { verifyJWT } from "./middlewares/auth.middleware.js";
import { loginPrincipal, logout, registerPrincipal } from "./src/controllers/principal.js";
import { loginStudent, registerStudent, logoutStudent, allStudent, editStudent, deleteStudent, getStudent } from "./src/controllers/student.js";
import { allTeachers, deleteTeacher, editTeacher, loginTeacher, logoutTeacher, registerTeacher } from "./src/controllers/teacher.js";
import { createClassroom, getallClass, getStudentClassroom, getteacherClass } from "./src/controllers/classroom.js";
import { getAttendence, markAttendence } from "./src/controllers/attendence.js";
import { getMessagesForRoom, saveMessage } from "./src/controllers/message.js";
import { createAssignment, getAssignmentsByStudent, getAssignmentsByTeacher } from "./src/controllers/assignment.js";

// Initialize the app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://classroom-management-frontend.vercel.app', // Allow only localhost
  credentials: true,               // Enable credentials (if using cookies/auth)
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.post('/register/principal', registerPrincipal);
app.post('/register/teacher', registerTeacher);
app.post('/register/student', registerStudent);
app.post('/login/principal', loginPrincipal);
app.post('/login/student', loginStudent);
app.post('/login/teacher', loginTeacher);
app.post('/logout/principal', verifyJWT, logout);
app.post('/logout/student', verifyJWT, logoutStudent);
app.post('/logout/teacher', verifyJWT, logoutTeacher);
app.post('/createClassroom', createClassroom);
app.get('/allTeachers', allTeachers);
app.post('/updateTeachers/:teacherId', editTeacher);
app.post('/deleteTeachers/:teacherId', deleteTeacher);
app.get('/allStudents', allStudent);
app.post('/updateStudents/:studentId', editStudent);
app.post('/deleteStudents/:studentId', deleteStudent);
app.post('/createClassroom', createClassroom);
app.get('/getallClass', getallClass);
app.get('/getteacherClass', verifyJWT, getteacherClass);
app.get('/getStudentById/:studentId', getStudent);
app.get('/getclassStudent', verifyJWT, getStudentClassroom);

// Attendance routes
app.post('/markAttendence', markAttendence);
app.get('/getAttendece', verifyJWT, getAttendence);

// Message routes (REST API)
app.get('/messages/:roomId', verifyJWT, getMessagesForRoom);
app.post('/messages', verifyJWT, saveMessage);

//assignemt
app.post('/assignments',verifyJWT,createAssignment );
app.get('/getassignments',verifyJWT,getAssignmentsByTeacher);
app.get('/getassignmentsbyStudent',verifyJWT,getAssignmentsByStudent);

  export default app;
