package com.triolingo.aggregate;

import com.triolingo.dto.lesson.LessonViewDTO;
import com.triolingo.dto.teacher.TeacherViewDTO;

public record LessonAggregate(
        LessonViewDTO lesson,
        TeacherViewDTO teacher) {

}
