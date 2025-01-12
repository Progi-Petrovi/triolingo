package com.triolingo.repository;

import com.triolingo.entity.lesson.LessonAvailabilityInterval;
import com.triolingo.entity.user.Teacher;

import java.time.Instant;
import java.util.Optional;

public interface LessonAvailabilityIntervalRepositoryCustom {
    public Optional<LessonAvailabilityInterval> findByInstantWithinIntervalAndTeacher(Instant instant, Teacher teacher);
}
