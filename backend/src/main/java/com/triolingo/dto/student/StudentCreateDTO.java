package com.triolingo.dto.student;

import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.KnowledgeLevel;

import java.util.Map;

public record StudentCreateDTO(
        String email,
        String password,
        String fullName,
        Map<String, KnowledgeLevel> learningLanguages,
        TeachingStyle preferredTeachingStyle,
        String learningGoals) {

}
