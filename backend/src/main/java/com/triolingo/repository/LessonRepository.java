package com.triolingo.repository;

import com.triolingo.entity.lesson.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
