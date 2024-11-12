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

    public Teacher transformIntoTeacher() {
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

    public void updateTeacher(Teacher teacher) {
        if (email != null)
            teacher.setEmail(email);
        if (password != null)
            teacher.setPassword(password);
        if (fullName != null)
            teacher.setFullName(fullName);
        if (fullName != null)
            teacher.setLanguages(languages);
        if (fullName != null)
            teacher.setYearsOfExperience(yearsOfExperience);
        if (fullName != null)
            teacher.setQualifications(qualifications);
        if (fullName != null)
            teacher.setTeachingStyle(teachingStyle);
        if (fullName != null)
            teacher.setProfilePictureHash(profilePictureHash);
        if (fullName != null)
            teacher.setHourlyRate(hourlyRate);

    }
}
