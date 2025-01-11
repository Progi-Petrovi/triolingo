import { TeachingStyle } from './teaching-style';

export type Teacher = {
    id: number;
    fullName: string;
    hourlyRate: number;
    languages: string[];
    profilePictureHash: string | null;
    qualifications: string;
    teachingStyle: TeachingStyle;
    yearsOfExperience: number;
};