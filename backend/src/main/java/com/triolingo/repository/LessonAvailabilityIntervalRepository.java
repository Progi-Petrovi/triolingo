package com.triolingo.repository;

import com.triolingo.entity.lesson.LessonAvailabilityInterval;
import com.triolingo.entity.user.Teacher;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonAvailabilityIntervalRepository
        extends JpaRepository<LessonAvailabilityInterval, Long>, LessonAvailabilityIntervalRepositoryCustom {
    List<LessonAvailabilityInterval> findAllByTeacher(Teacher teacher);

    void deleteAllByTeacherAndStartInstantBetween(Teacher teacher, Instant startInstant, Instant endInstant);

    void deleteAllByEndInstantGreaterThan(Instant instant);
}
