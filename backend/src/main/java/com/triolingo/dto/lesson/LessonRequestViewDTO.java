package com.triolingo.dto.lesson;

import com.triolingo.entity.lesson.LessonRequest;

public record LessonRequestViewDTO(Long student, Long lesson, LessonRequest.Status status) {

}
