package com.triolingo.dto.teacher;

import java.util.List;
import com.triolingo.entity.TeachingStyle;

public record TeacherFullDTO(
        Long id,
        String email,
        String password,
        String fullName,
        Boolean verified,
        List<String> languages,
        Integer yearsOfExperience,
        String qualifications,
        TeachingStyle teachingStyle,
        String profileImageHash,
        Double hourlyRate,
        String phoneNumber) {

}
