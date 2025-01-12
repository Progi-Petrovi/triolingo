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
    TEACHERPROFILE: "/teacher/:id",
    API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
};

export default PathConstants;
