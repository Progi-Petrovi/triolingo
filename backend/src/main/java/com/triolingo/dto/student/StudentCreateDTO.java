package com.triolingo.dto.student;

import com.triolingo.entity.Student;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.LearningLanguage;
import com.triolingo.repository.LanguageRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

public record StudentCreateDTO(
        String email,
        String password,
        String fullName,
        //List<String> languages,
        //List<KnowledgeLevel> knowledgeLevels,
        List<LearningLanguage> learningLanguages,
        TeachingStyle preferredTeachingStyle,
        String learningGoals) {

    public StudentCreateDTO(Student student) {
        this(student.getEmail(),
                student.getPassword(),
                student.getFullName(),
                //student.getLearningLanguages().stream().map(languageLevel -> languageLevel.getLanguage().getName()).toList(),
                //student.getLearningLanguages().stream().map(languageLevel -> languageLevel.getKnowledgeLevel()).toList(),
                student.getLearningLanguages(),
                student.getPreferredTeachingStyle(),
                student.getLearningGoals());
    }

    public Student transformIntoStudent(LanguageRepository languageRepository, PasswordEncoder passwordEncoder) {
        return Student.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .learningLanguages(learningLanguages)
                .preferredTeachingStyle(preferredTeachingStyle)
                .learningGoals(learningGoals).build();
    }

    public void updateStudent(Student student, LanguageRepository languageRepository, PasswordEncoder passwordEncoder) {
        if (email != null)
            student.setEmail(email);
        if (password != null)
            student.setPassword(passwordEncoder.encode(password));
        if (fullName != null)
            student.setFullName(fullName);
        if (fullName != null)
            student.setLearningLanguages(learningLanguages);
        if (fullName != null)
            student.setPreferredTeachingStyle(preferredTeachingStyle);
        if (fullName != null)
            student.setLearningGoals(learningGoals);

    }
}
