const PathConstants = {
	HOME: "/",
	LOGIN: "/login",
	STUDENT_REGISTER: "/student/register",
	TEACHER_REGISTER: "/teacher/register",
	VERIFY_SUCCESS: "/verify/success",
	API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
};

export default PathConstants;
