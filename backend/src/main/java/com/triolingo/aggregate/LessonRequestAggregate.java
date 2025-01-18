package com.triolingo.aggregate;

import com.triolingo.dto.lesson.LessonRequestViewDTO;
import com.triolingo.dto.student.StudentViewDTO;

public record LessonRequestAggregate(
        LessonRequestViewDTO request,
        LessonAggregate lessonAggregate,
        StudentViewDTO student) {

}
