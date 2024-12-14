package com.triolingo.dto.student;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.triolingo.entity.*;
import com.triolingo.entity.language.*;
import com.triolingo.repository.LanguageRepository;
import com.triolingo.repository.LearningLanguageRepository;

public class StudentTranslator {

    private final PasswordEncoder passwordEncoder;
    private final LanguageRepository languageRepository;
    private final LearningLanguageRepository learningLanguageRepository;

    public StudentTranslator(PasswordEncoder passwordEncoder, LanguageRepository languageRepository,
            LearningLanguageRepository learningLanguageRepository) {
        this.passwordEncoder = passwordEncoder;
        this.languageRepository = languageRepository;
        this.learningLanguageRepository = learningLanguageRepository;
    }

    public Student fromDTO(StudentCreateDTO dto) {
        return Student.builder()
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .fullName(dto.fullName())
                .learningLanguages(deserializeLearningLanguages(dto.learningLanguages()))
                .preferredTeachingStyle(dto.preferredTeachingStyle())
                .learningGoals(dto.learningGoals()).build();
    }

    public StudentGetDTO toDTO(Student student) {
        return new StudentGetDTO(
                student.getId(),
                student.getFullName(),
                serializeLearningLanguages(student.getLearningLanguages()),
                student.getPreferredTeachingStyle(), student.getLearningGoals());
    }

    public void updateStudent(Student student, StudentCreateDTO dto) {
        if (dto.email() != null)
            student.setEmail(dto.email());
        if (dto.password() != null)
            student.setPassword(passwordEncoder.encode(dto.password()));
        if (dto.fullName() != null)
            student.setFullName(dto.fullName());
        if (dto.learningLanguages() != null)
            student.setLearningLanguages(deserializeLearningLanguages(dto.learningLanguages()));
        if (dto.preferredTeachingStyle() != null)
            student.setPreferredTeachingStyle(dto.preferredTeachingStyle());
        if (dto.learningGoals() != null)
            student.setLearningGoals(dto.learningGoals());

    }

    private Map<String, KnowledgeLevel> serializeLearningLanguages(List<LearningLanguage> learningLanguages) {
        return learningLanguages.stream()
                .collect(Collectors.toMap((learningLanguage) -> learningLanguage.getLanguage().getName(),
                        (learningLanguage) -> learningLanguage.getKnowledgeLevel()));
    }

    private List<LearningLanguage> deserializeLearningLanguages(Map<String, KnowledgeLevel> learningLanguageMap) {
        return learningLanguageMap.entrySet().stream().map((entry) -> {
            Language language = languageRepository.findByName(entry.getKey()).get();
            LearningLanguage learningLanguage = learningLanguageRepository
                    .findByLanguageAndKnowledgeLevel(language, entry.getValue()).get();
            return learningLanguage;
        }).toList();
    }
}
