package com.triolingo.repository;

import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.List;

public class LessonRequestRepositoryCustomImpl implements LessonRequestRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<LessonRequest> findAllByTeacher(Teacher teacher) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LessonRequest> query = builder.createQuery(LessonRequest.class);
        Root<LessonRequest> requestRoot = query.from(LessonRequest.class);
        Join<LessonRequest, Lesson> lessonJoin = requestRoot.join(LessonRequest.Fields.lesson);

        return entityManager.createQuery(
                query.where(builder.equal(lessonJoin.get(Lesson.Fields.teacher), teacher)))
                .getResultList();
    }

    @Override
    public boolean existsByTeacherAndStudentAndStatus(Teacher teacher, Student student, LessonRequest.Status status) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LessonRequest> query = builder.createQuery(LessonRequest.class);
        Root<LessonRequest> requestRoot = query.from(LessonRequest.class);
        Join<LessonRequest, Lesson> lessonJoin = requestRoot.join(LessonRequest.Fields.lesson);

        Predicate predicate = builder.and(
                builder.equal(lessonJoin.get(Lesson.Fields.teacher), teacher),
                builder.equal(requestRoot.get(LessonRequest.Fields.student), student),
                builder.equal(requestRoot.get(LessonRequest.Fields.status), status));

        return !entityManager.createQuery(
                query.where(predicate))
                .getResultList().isEmpty();
    }
}
