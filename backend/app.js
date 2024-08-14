import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { verifyJWT } from "./middlewares/auth.middleware.js";
import { loginPrincipal, logout, registerPrincipal } from "./src/controllers/principal.js";
import { loginStudent, registerStudent, logoutStudent, allStudent, editStudent, deleteStudent, getStudent } from "./src/controllers/student.js";
import { allTeachers, deleteTeacher, editTeacher, loginTeacher, logoutTeacher, registerTeacher } from "./src/controllers/teacher.js";
import { createClassroom, getallClass, getStudentClassroom, getteacherClass } from "./src/controllers/classroom.js";


const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'https://classroom-management-frontend.vercel.app',
  credentials: true 
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
  app.post('/logout/principal', verifyJWT,logout);
  app.post('/logout/student', verifyJWT,logoutStudent);
  app.post('/logout/teacher', verifyJWT,logoutTeacher);
  app.post('/createClassroom',createClassroom);
  app.get('/allTeachers',allTeachers);
  app.post('/updateTeachers/:teacherId',editTeacher);
  app.post('/deleteTeachers/:teacherId',deleteTeacher);
  app.get('/allStudents',allStudent);
  app.post('/updateStudents/:studentId',editStudent);
  app.post('/deleteStudents/:studentId',deleteStudent);
  app.post('/createClassroom',createClassroom);
  app.get('/getallClass',getallClass);
  app.get('/getteacherClass',verifyJWT,getteacherClass);
  app.get('/getStudentById/:studentId',getStudent);
  app.get('/getclassStudent',verifyJWT, getStudentClassroom);
  



  export default app;
