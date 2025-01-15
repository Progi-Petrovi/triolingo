import { User, Teacher, Student, Role } from "./users";

export type ProfileProps = {
    userProfile: User | Teacher | Student;
    role: Role;
    profileOwner?: boolean;
};