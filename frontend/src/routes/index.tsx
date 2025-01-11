/* eslint-disable react-refresh/only-export-components */
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
const VerifySuccess = React.lazy(() => import("../pages/verify/VerifySuccess"));
const VerifyRequest = React.lazy(() => import("../pages/verify/VerifyRequest"));
const Profile = React.lazy(() => import("../pages/profile/Profile"));

const routes = [
    { path: PathConstants.HOME, element: <Home /> },
    { path: PathConstants.LOGIN, element: <Login /> },
    { path: PathConstants.STUDENT_REGISTER, element: <StudentRegister /> },
    { path: PathConstants.TEACHER_REGISTER, element: <TeacherRegister /> },
    { path: PathConstants.VERIFY_SUCCESS, element: <VerifySuccess /> },
    { path: PathConstants.VERIFY_REQUEST, element: <VerifyRequest /> },
    { path: PathConstants.PROFILE, element: <Profile /> },
];

export default routes;
