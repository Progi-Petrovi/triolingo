package com.triolingo.dto.teacher;

import java.util.List;
import com.triolingo.entity.TeachingStyle;

public record TeacherGetDTO(
        Long id,
        String fullName,
        List<String> languages,
        Integer yearsOfExperience,
        String qualifications,
        TeachingStyle teachingStyle,
        String profilePictureHash,
        Double hourlyRate) {

}
