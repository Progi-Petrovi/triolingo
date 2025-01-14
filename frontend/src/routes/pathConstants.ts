const PathConstants = {
    HOME: "/",
    LOGIN: "/login",
    LOG_OUT: "/logout",
    STUDENT_REGISTER: "/student/register",
    TEACHER_REGISTER: "/teacher/register",
    VERIFY_REQUEST: "/verify",
    VERIFY_SUCCESS: "/verify/success",
    PROFILE: "/profile",
    CALENDAR: "/calendar",
    TEACHER_PROFILE: "/teacher/:id",
    TEACHER_REVIEWS: "/teacher/reviews/:id",
    STUDENT_PROFILE: "/student/:id",
    API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
};

export default PathConstants;
