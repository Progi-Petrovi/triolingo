package com.triolingo.repository;

import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;

import java.util.List;

public interface LessonRequestRepositoryCustom {
    List<LessonRequest> findAllByTeacher(Teacher teacher);

    boolean existsByTeacherAndStudentAndStatus(Teacher teacher, Student student, LessonRequest.Status status);
}
