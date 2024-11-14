package com.triolingo.dto.teacher;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.triolingo.entity.Teacher;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.repository.LanguageRepository;

public record TeacherCreateDTO(
        String email,
        String password,
        String fullName,
        List<String> languages,
        Integer yearsOfExperience,
        String qualifications,
        TeachingStyle teachingStyle,
        String profilePictureHash,
        Double hourlyRate) {

    public TeacherCreateDTO(Teacher teacher) {
        this(teacher.getEmail(),
                teacher.getPassword(),
                teacher.getFullName(),
                teacher.getLanguages().stream().map(language -> language.getName()).toList(),
                teacher.getYearsOfExperience(),
                teacher.getQualifications(),
                teacher.getTeachingStyle(),
                teacher.getProfilePictureHash(),
                teacher.getHourlyRate());
    }

    public Teacher transformIntoTeacher(LanguageRepository languageRepository, PasswordEncoder passwordEncoder) {
        return Teacher.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .languages(languages.stream()
                        .map(languageName -> languageRepository.findByName(languageName).get())
                        .toList())
                .yearsOfExperience(yearsOfExperience)
                .qualifications(qualifications)
                .teachingStyle(teachingStyle)
                .profilePictureHash(profilePictureHash)
                .hourlyRate(hourlyRate).build();
    }

    public void updateTeacher(Teacher teacher, LanguageRepository languageRepository, PasswordEncoder passwordEncoder) {
        if (email != null)
            teacher.setEmail(email);
        if (password != null)
            teacher.setPassword(passwordEncoder.encode(password));
        if (fullName != null)
            teacher.setFullName(fullName);
        if (fullName != null)
            teacher.setLanguages(languages.stream()
                    .map(languageName -> languageRepository.findByName(languageName).get())
                    .toList());
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
