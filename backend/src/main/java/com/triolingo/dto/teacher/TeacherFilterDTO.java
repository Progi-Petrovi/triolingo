package com.triolingo.dto.teacher;

import java.util.List;
import com.triolingo.entity.TeachingStyle;

public record TeacherFilterDTO(
        List<String> languages,
        Integer minYearsOfExperience, Integer maxYearsOfExperience,
        List<TeachingStyle> teachingStyles,
        Double minHourlyRate, Double maxHourlyRate,
        Order order) {

    public enum Order {
        ALPHABETICAL_DESC, ALPHABETICAL_ASC,
        YEARS_OF_EXPERIENCE_DESC, YEARS_OF_EXPERIENCE_ASC,
        HOURLY_RATE_DESC, HOURLY_RATE_ASC;
    }

}
