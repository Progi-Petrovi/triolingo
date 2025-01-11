package com.triolingo.repository;

import com.triolingo.entity.lesson.LessonAvailabilityInterval;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonAvailabilityIntervalRepository extends JpaRepository<LessonAvailabilityInterval, Long> {
}
