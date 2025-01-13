package com.triolingo.repository;

import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.user.Teacher;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long>, LessonRepositoryCustom {
    List<Lesson> findAllByTeacher(Teacher teacher);

    List<Lesson> findAllByTeacherAndStatus(Teacher teacher, Lesson.Status status);

    List<Lesson> findAllByStatusAndEndInstantLessThan(Lesson.Status status, Instant instant);

    boolean existsByStartInstantLessThanEqualAndEndInstantGreaterThanEqual(Instant startInstant, Instant endInstant);
}
