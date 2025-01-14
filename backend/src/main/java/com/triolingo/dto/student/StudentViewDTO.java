package com.triolingo.dto.student;

import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.*;

import java.util.Map;

public record StudentViewDTO(
        Long id,
        String fullName,
        String email,
        Map<String, KnowledgeLevel> learningLanguages,
        TeachingStyle preferredTeachingStyle,
        String learningGoals) {
}
