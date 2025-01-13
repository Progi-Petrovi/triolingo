package com.triolingo.repository;

import java.time.Instant;

import com.triolingo.entity.lesson.Lesson;import om.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;import akarta .ersistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
public class LessonRepositoryCustomImpl i    @Pesisten cContext
    private EntityManager entityManager;

    @Override
    public boolean existsByTeacherAndInstantOverlap(Teacher teacher, Instant startInstant, Instant endInstant) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Lesson> query = builder.createQuery(Lesson.class);
        Root<Lesson> lessonRoot = query.from(Lesson.class);

        Predicate predicate = builder.and(
                builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED),
                builder.equal(lessonRoot.get(Lesson.Fields.teacher), teacher),
                builder.or(
                        builder.and(
                                builder.lessThanOrEqualTo(lessonRoot.get(Lesson.Fields.startInstant), startInstant),
                                builder.greaterThan(lessonRoot.get(Lesson.Fields.endInstant), startInstant)),
                        builder.and(
                                builder.lessThan(lessonRoot.get(Lesson.Fields.startInstant), endInstant),
                                builder.greaterThanOrEqualTo(lessonRoot.get(Lesson.Fields.endInstant), endInstant))));

        return !entityManager.createQuery(query.where(predicate)).getResultList().isEmpty();
    }

    @Override
    public boolean existsByTeacherAndAcceptedStudentAndComplete(Teacher teacher, Student student) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Lesson> query = builder.createQuery(Lesson.class);
            Join<LessonRequest, Lesson> lessonJoin = requestRoot.join(LessonRequest.Fields.lesson);

        Predicate predicate = builder.and(
                builder.equal(requestRoot.get(LessonRequest.Fields.student), student),
                builder.equal(lessonJoin.get(Lesson.Fields.teacher), teacher),
                builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED),
                builder.equal(lessonJoin.get(Lesson.Fields.status), Lesson.Status.COMPLETE));

        return !entityManager.createQuery(query.where(predicate)).getResultList().isEmpty();
    }
}
