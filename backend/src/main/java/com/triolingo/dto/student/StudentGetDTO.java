package com.triolingo.dto.student;

import com.triolingo.entity.Student;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.LearningLanguage;

import java.util.List;

public record StudentGetDTO(
        Long id,
        String fullName,
        List<LearningLanguage> learningLanguages,
        TeachingStyle preferredTeachingStyle,
        String learningGoals) {

    public StudentGetDTO(Student student) {
        this(student.getId(),
                student.getFullName(),
                student.getLearningLanguages(),
                student.getPreferredTeachingStyle(),
                student.getLearningGoals());
    }

}
