package com.triolingo.aggregate;

import java.util.List;

import com.triolingo.dto.lesson.LessonViewDTO;
import com.triolingo.dto.teacher.TeacherViewDTO;

public record LessonBulkAggregate(
        List<LessonViewDTO> lessons,
        List<TeacherViewDTO> teachers) {

}
