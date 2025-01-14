package com.triolingo.dto.lesson;

import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;

import java.time.Instant;

public record LessonRequestViewDTO(String studentFullName, Long id, Long lessonId, String teacherFullName,
                                   Instant startInstant, Instant endInstant,
                                   String language, LessonRequest.Status status) {

}
