package com.triolingo.aggregate;

import java.util.List;

import com.triolingo.dto.lesson.LessonRequestViewDTO;
import com.triolingo.dto.student.StudentViewDTO;

public record LessonRequestBulkAggregate(
        List<LessonRequestViewDTO> requests,
        LessonBulkAggregate lessonBulkAggregate,
        List<StudentViewDTO> students) {

}
