package com.triolingo.repository;

import java.time.Instant;

import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.user.Teacher;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class LessonRepositoryCustomImpl implements LessonRepositoryCustom {

    @PersistenceContext
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
}
