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
const VerifySuccess = React.lazy(
    () => import("../pages/register/VerifySuccess")
);
const Profile = React.lazy(() => import("../pages/profile/Profile"));

const Calendar = React.lazy(() => import("../pages/Calendar"));

const Teacher = React.lazy(() => import("../pages/Teacher"));

const routes = [
    { path: PathConstants.HOME, element: <Home /> },
    { path: PathConstants.LOGIN, element: <Login /> },
    { path: PathConstants.STUDENT_REGISTER, element: <StudentRegister /> },
    { path: PathConstants.TEACHER_REGISTER, element: <TeacherRegister /> },
    { path: PathConstants.VERIFY_SUCCESS, element: <VerifySuccess /> },
    { path: PathConstants.PROFILE, element: <Profile /> },
    { path: PathConstants.CALENDAR, element: <Calendar /> },
    { path: PathConstants.TEACHERPROFILE, element: <Teacher /> },
];

export default routes;
