package com.triolingo.repository;

import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findAllByTeacher(Teacher teacher);

    List<Lesson> findAllByStudent(Student student);
}
