package com.triolingo.dto.teacher;

import java.util.List;

import com.triolingo.entity.Teacher;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.Language;

public record TeacherGetDTO(
        Long id,
        String fullName,
        List<Language> languages,
        Integer yearsOfExperience,
        String qualifications,
        TeachingStyle teachingStyle,
        String profilePictureHash,
        Double hourlyRate) {

    public TeacherGetDTO(Teacher teacher) {
        this(teacher.getId(),
                teacher.getFullName(),
                teacher.getLanguages(),
                teacher.getYearsOfExperience(),
                teacher.getQualifications(),
                teacher.getTeachingStyle(),
                teacher.getProfilePictureHash(),
                teacher.getHourlyRate());
    }

}
