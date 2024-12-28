package com.triolingo.dto.student;

import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.KnowledgeLevel;

import java.util.Map;

public record StudentFullDTO(
        Long id,
        String email,
        String password,
        String fullName,
        boolean isVerified,
        Map<String, KnowledgeLevel> learningLanguages,
        TeachingStyle preferredTeachingStyle,
        String learningGoals) {

}
