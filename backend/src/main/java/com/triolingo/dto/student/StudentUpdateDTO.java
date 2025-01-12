package com.triolingo.dto.student;

import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.KnowledgeLevel;

import java.util.Map;

public record StudentUpdateDTO(
        String email,
        String fullName,
        Map<String, KnowledgeLevel> learningLanguages,
        TeachingStyle preferredTeachingStyle,
        String learningGoals) {

}
