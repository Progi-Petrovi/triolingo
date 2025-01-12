package com.triolingo.repository;

import com.triolingo.entity.lesson.LessonAvailabilityInterval;

import java.time.Instant;
import java.util.Optional;

public interface LessonAvailabilityIntervalRepositoryCustom {
    public Optional<LessonAvailabilityInterval> findByInstantWithinInterval(Instant instant);
}
