package com.triolingo.repository;

import java.time.Instant;
import java.util.List;

import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.entity.lesson.Lesson;

public interface LessonRepositoryCustom {
    boolean existsByTeacherAndInstantOverlap(Teacher teacher, Instant startInstant, Instant endInstant);

    boolean existsByTeacherAndAcceptedStudentAndComplete(Teacher teacher, Student student);

    List<Lesson> findAllByStudent(Student student);
}
