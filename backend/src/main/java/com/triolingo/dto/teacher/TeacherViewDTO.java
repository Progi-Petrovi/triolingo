package com.triolingo.dto.teacher;

import java.util.List;
import com.triolingo.entity.TeachingStyle;

public record TeacherViewDTO(
        Long id,
        String fullName,
        String email,
        List<String> languages,
        Integer yearsOfExperience,
        String qualifications,
        TeachingStyle teachingStyle,
        String profileImageHash,
        Double hourlyRate,
        String phoneNumber) {
}
