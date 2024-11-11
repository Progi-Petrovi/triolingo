package com.triolingo.dto.teacher;

import java.util.List;

import com.triolingo.entity.Teacher;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.Language;

public record TeacherCreateDTO(
        String email,
        String password,
        String fullName,
        List<Language> languages,
        Integer yearsOfExperience,
        List<String> qualifications,
        TeachingStyle teachingStyle,
        String profilePictureHash,
        Double hourlyRate) {

    public TeacherCreateDTO(Teacher teacher) {
        this(teacher.getEmail(),
                teacher.getPassword(),
                teacher.getFullName(),
                teacher.getLanguages(),
                teacher.getYearsOfExperience(),
                teacher.getQualifications(),
                teacher.getTeachingStyle(),
                teacher.getProfilePictureHash(),
                teacher.getHourlyRate());
    }

    public Teacher Transform() {
        return Teacher.builder()
                .email(email)
                .password(password)
                .fullName(fullName)
                .languages(languages)
                .yearsOfExperience(yearsOfExperience)
                .qualifications(qualifications)
                .teachingStyle(teachingStyle)
                .profilePictureHash(profilePictureHash)
                .hourlyRate(hourlyRate).build();
    }

}
