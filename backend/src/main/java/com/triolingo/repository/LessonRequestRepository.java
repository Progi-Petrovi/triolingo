package com.triolingo.repository;

import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRequestRepository extends JpaRepository<LessonRequest, Long>, LessonRequestRepositoryCustom {
    List<LessonRequest> findAllByStudent(Student student);

    List<LessonRequest> findAllByLesson(Lesson lesson);

    List<LessonRequest> findAllByStudentAndStatus(Student student, LessonRequest.Status status);

    List<LessonRequest> findAllByLessonAndStatus(Lesson lesson, LessonRequest.Status status);

    boolean existsByStudentAndLessonAndStatus(Student student, Lesson lesson, LessonRequest.Status status);
}
