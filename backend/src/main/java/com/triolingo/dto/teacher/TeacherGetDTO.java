package com.triolingo.dto.teacher;

import java.util.List;

import com.triolingo.entity.Teacher;
import com.triolingo.entity.TeachingStyle;

public record TeacherGetDTO(
        Long id,
        String fullName,
        List<String> languages,
        Integer yearsOfExperience,
        String qualifications,
        TeachingStyle teachingStyle,
        String profilePictureHash,
        Double hourlyRate) {

    public TeacherGetDTO(Teacher teacher) {
        this(teacher.getId(),
                teacher.getFullName(),
                teacher.getLanguages().stream().map(language -> language.getName()).toList(),
                teacher.getYearsOfExperience(),
                teacher.getQualifications(),
                teacher.getTeachingStyle(),
                teacher.getProfilePictureHash(),
                teacher.getHourlyRate());
    }

}
