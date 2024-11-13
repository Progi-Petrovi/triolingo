import React from "react";
import PathConstants from "./pathConstants";

const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const StudentRegister = React.lazy(
  () => import("../pages/register/StudentRegister")
);
const TeacherRegister = React.lazy(
  () => import("../pages/register/TeacherRegister")
);

const routes = [
  { path: PathConstants.HOME, element: <Home /> },
  { path: PathConstants.LOGIN, element: <Login /> },
  { path: PathConstants.STUDENT_REGISTER, element: <StudentRegister /> },
  { path: PathConstants.TEACHER_REGISTER, element: <TeacherRegister /> },
];

export default routes;
