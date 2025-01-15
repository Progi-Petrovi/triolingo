package com.triolingo.dto.lesson;

import java.time.Instant;

import com.triolingo.entity.lesson.Lesson;

public record LessonViewDTO(
        Long id,
        Long teacher,
        Lesson.Status status,
        Instant startInstant, Instant endInstant,
        String language,
        double teacherPayment) {

}
