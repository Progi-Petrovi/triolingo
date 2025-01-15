package com.triolingo.dto.lesson;

import java.time.Instant;

import com.triolingo.entity.lesson.Lesson;

public record LessonViewDTO(
        Long id,
        String teacherFullName,
        String teacherProfilePictureHash,
        Long teacher,
        Lesson.Status status,
        Instant startInstant, Instant endInstant,
        String language,
        Double teacherPayment) {

}
