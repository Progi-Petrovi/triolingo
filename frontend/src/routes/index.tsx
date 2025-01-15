/* eslint-disable react-refresh/only-export-components */
import React from "react";
import PathConstants from "./pathConstants";

const Home = React.lazy(() => import("../pages/home/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Logout = React.lazy(() => import("../pages/Logout"));
const StudentRegister = React.lazy(
    () => import("../pages/register/StudentRegister")
);
const TeacherRegister = React.lazy(
    () => import("../pages/register/TeacherRegister")
);
const VerifySuccess = React.lazy(() => import("../pages/verify/VerifySuccess"));
const VerifyRequest = React.lazy(() => import("../pages/verify/VerifyRequest"));
const Profile = React.lazy(() => import("../pages/profile/Profile"));

const Calendar = React.lazy(() => import("../pages/Calendar"));

const TeacherReviews = React.lazy(() => import("../pages/TeacherReviews"));

const BookLessonStudent = React.lazy(
    () => import("../pages/BookLessonStudent")
);

const LessonRequests = React.lazy(() => import("../pages/LessonRequests"));

const BookLessonStudent = React.lazy(
    () => import("../pages/BookLessonStudent")
);

const LessonRequests = React.lazy(() => import("../pages/LessonRequests"));

const PendingRequests = React.lazy(() => import("../pages/PendingRequests"));

import UserProfile from "../pages/profile/UserProfile";

const routes = [
    { path: PathConstants.HOME, element: <Home /> },
    { path: PathConstants.LOGIN, element: <Login /> },
    { path: PathConstants.LOG_OUT, element: <Logout /> },
    { path: PathConstants.STUDENT_REGISTER, element: <StudentRegister /> },
    { path: PathConstants.TEACHER_REGISTER, element: <TeacherRegister /> },
    { path: PathConstants.VERIFY_SUCCESS, element: <VerifySuccess /> },
    { path: PathConstants.VERIFY_REQUEST, element: <VerifyRequest /> },
    { path: PathConstants.PROFILE, element: <Profile /> },
    { path: PathConstants.CALENDAR, element: <Calendar /> },
    { path: PathConstants.TEACHER_PROFILE, element: <UserProfile /> },
    { path: PathConstants.STUDENT_PROFILE, element: <UserProfile /> },
    { path: PathConstants.TEACHER_REVIEWS, element: <TeacherReviews /> },
    { path: PathConstants.BOOK_LESSON_STUDENT, element: <BookLessonStudent /> },
    { path: PathConstants.LESSON_REQUESTS, element: <LessonRequests /> },
    { path: PathConstants.PENDING_REQUESTS, element: <PendingRequests /> },
];

export default routes;
