package com.triolingo.dto.teacher;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.triolingo.entity.Teacher;
import com.triolingo.repository.LanguageRepository;

@Service
public class TeacherTranslator {

    private final PasswordEncoder passwordEncoder;
    private final LanguageRepository languageRepository;

    public TeacherTranslator(PasswordEncoder passwordEncoder, LanguageRepository languageRepository) {
        this.passwordEncoder = passwordEncoder;
        this.languageRepository = languageRepository;
    }

    public Teacher fromDTO(TeacherCreateDTO dto) {

        return Teacher.builder()
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .fullName(dto.fullName())
                .languages(dto.languages().stream()
                        .map(languageName -> languageRepository.findByName(languageName).get())
                        .toList())
                .yearsOfExperience(dto.yearsOfExperience())
                .qualifications(dto.qualifications())
                .teachingStyle(dto.teachingStyle())
                .profilePictureHash(dto.profilePictureHash())
                .hourlyRate(dto.hourlyRate()).build();
    }

    public TeacherGetDTO toDTO(Teacher teacher) {
        return new TeacherGetDTO(teacher.getId(),
                teacher.getFullName(),
                teacher.getLanguages().stream().map(language -> language.getName()).toList(),
                teacher.getYearsOfExperience(),
                teacher.getQualifications(),
                teacher.getTeachingStyle(),
                teacher.getProfilePictureHash(),
                teacher.getHourlyRate());
    }

    public void updateTeacher(Teacher teacher, TeacherCreateDTO dto) {
        if (dto.email() != null)
            teacher.setEmail(dto.email());
        if (dto.password() != null)
            teacher.setPassword(passwordEncoder.encode(dto.password()));
        if (dto.fullName() != null)
            teacher.setFullName(dto.fullName());
        if (dto.languages() != null)
            teacher.setLanguages(dto.languages().stream()
                    .map(languageName -> languageRepository.findByName(languageName).get())
                    .toList());
        if (dto.yearsOfExperience() != null)
            teacher.setYearsOfExperience(dto.yearsOfExperience());
        if (dto.qualifications() != null)
            teacher.setQualifications(dto.qualifications());
        if (dto.teachingStyle() != null)
            teacher.setTeachingStyle(dto.teachingStyle());
        if (dto.profilePictureHash() != null)
            teacher.setProfilePictureHash(dto.profilePictureHash());
        if (dto.hourlyRate() != null)
            teacher.setHourlyRate(dto.hourlyRate());

    }
}
