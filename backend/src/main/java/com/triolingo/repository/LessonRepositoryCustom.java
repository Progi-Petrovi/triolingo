package com.triolingo.repository;

import java.time.Instant;

import com.triolingo.entity.user.Teacher;

public interface LessonRepositoryCustom {
    boolean existsByTeacherAndInstantOverlap(Teacher teacher, Instant startInstant, Instant endInstant);
}
