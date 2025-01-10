//import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";

export default function Profile() {
    //TODO: get authenticated user from context and based on the role go to either TeacherProfile or StudentProfile
    return <TeacherProfile />;
}
