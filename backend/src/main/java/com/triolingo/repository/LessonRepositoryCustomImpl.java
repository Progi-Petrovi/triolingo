package com.triolingo.repository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import com.triolingo.entity.lesson.Lesson;

import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;

import com.triolingo.entity.user.Teacher;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.CriteriaUpdate;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import jakarta.persistence.criteria.Predicate;

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

        Order order = builder.desc(lessonRoot.get(Lesson.Fields.startInstant));

        return !entityManager.createQuery(query.where(predicate).orderBy(order)).getResultList().isEmpty();
    }

    @Override
    public boolean existsByTeacherAndAcceptedStudentAndComplete(Teacher teacher, Student student) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LessonRequest> query = builder.createQuery(LessonRequest.class);

        Root<LessonRequest> requestRoot = query.from(LessonRequest.class);
        Join<LessonRequest, Lesson> lessonJoin = requestRoot.join(LessonRequest.Fields.lesson);

        Predicate predicate = builder.and(
                builder.equal(requestRoot.get(LessonRequest.Fields.student), student),
                builder.equal(lessonJoin.get(Lesson.Fields.teacher), teacher),
                builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED),
                builder.equal(lessonJoin.get(Lesson.Fields.status), Lesson.Status.COMPLETE));

        Order order = builder.desc(lessonJoin.get(Lesson.Fields.startInstant));

        return !entityManager.createQuery(query.where(predicate).orderBy(order)).getResultList().isEmpty();
    }

    @Override
    public List<Lesson> findAllByStudent(Student student) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Lesson> query = builder.createQuery(Lesson.class);

        Root<LessonRequest> requestRoot = query.from(LessonRequest.class);
        Join<LessonRequest, Lesson> lessonJoin = requestRoot.join(LessonRequest.Fields.lesson);

        Predicate predicate = builder.equal(requestRoot.get(LessonRequest.Fields.student), student);
        Order order = builder.desc(lessonJoin.get(Lesson.Fields.startInstant));

        return entityManager
                .createQuery(
                        query.select(lessonJoin).where(predicate)
                                .groupBy(requestRoot.get(LessonRequest.Fields.lesson))
                                .orderBy(order))
                .getResultList();
    }

    @Override
    public void updateStatusIfExpired(Collection<Lesson> lessons) {
        {// change status to complete for lessons with accepted requests
            CriteriaBuilder builder = entityManager.getCriteriaBuilder();

            CriteriaUpdate<Lesson> query = builder.createCriteriaUpdate(Lesson.class);
            Root<Lesson> lessonRoot = query.from(Lesson.class);

            Subquery<LessonRequest> subquery = query.subquery(LessonRequest.class);
            Root<LessonRequest> requestRoot = subquery.from(LessonRequest.class);

            subquery.where(builder.and(
                    builder.equal(requestRoot.get(LessonRequest.Fields.lesson), lessonRoot),
                    builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED)));

            Predicate predicate = builder.and(
                    builder.exists(subquery),
                    lessonRoot.in(lessons),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.COMPLETE),
                    builder.or(
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.OPEN),
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CLOSED)),
                    builder.lessThanOrEqualTo(lessonRoot.get(Lesson.Fields.endInstant), Instant.now()));

            entityManager.createQuery(
                    query.where(predicate).set(lessonRoot.get(Lesson.Fields.status), Lesson.Status.COMPLETE))
                    .executeUpdate();
        }
        {// change status to canceled for lessons without accepted requests
            CriteriaBuilder builder = entityManager.getCriteriaBuilder();

            CriteriaUpdate<Lesson> query = builder.createCriteriaUpdate(Lesson.class);
            Root<Lesson> lessonRoot = query.from(Lesson.class);

            Subquery<LessonRequest> subquery = query.subquery(LessonRequest.class);
            Root<LessonRequest> requestRoot = subquery.from(LessonRequest.class);

            subquery.where(builder.and(
                    builder.equal(requestRoot.get(LessonRequest.Fields.lesson), lessonRoot),
                    builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED)));

            Predicate predicate = builder.and(
                    builder.not(builder.exists(subquery)),
                    lessonRoot.in(lessons),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.COMPLETE),
                    builder.or(
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.OPEN),
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CLOSED)),
                    builder.lessThanOrEqualTo(lessonRoot.get(Lesson.Fields.endInstant), Instant.now()));

            entityManager.createQuery(
                    query.where(predicate).set(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED))
                    .executeUpdate();
        }
    }

    @Override
    public void updateAllStatusIfExpired() {
        {// change status to complete for lessons with accepted requests
            CriteriaBuilder builder = entityManager.getCriteriaBuilder();

            CriteriaUpdate<Lesson> query = builder.createCriteriaUpdate(Lesson.class);
            Root<Lesson> lessonRoot = query.from(Lesson.class);

            Subquery<LessonRequest> subquery = query.subquery(LessonRequest.class);
            Root<LessonRequest> requestRoot = subquery.from(LessonRequest.class);

            subquery.where(builder.and(
                    builder.equal(requestRoot.get(LessonRequest.Fields.lesson), lessonRoot),
                    builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED)));

            Predicate predicate = builder.and(
                    builder.exists(subquery),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.COMPLETE),
                    builder.or(
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.OPEN),
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CLOSED)),
                    builder.lessThanOrEqualTo(lessonRoot.get(Lesson.Fields.endInstant), Instant.now()));

            entityManager.createQuery(
                    query.where(predicate).set(lessonRoot.get(Lesson.Fields.status), Lesson.Status.COMPLETE))
                    .executeUpdate();
        }
        {// change status to canceled for lessons without accepted requests
            CriteriaBuilder builder = entityManager.getCriteriaBuilder();

            CriteriaUpdate<Lesson> query = builder.createCriteriaUpdate(Lesson.class);
            Root<Lesson> lessonRoot = query.from(Lesson.class);

            Subquery<LessonRequest> subquery = query.subquery(LessonRequest.class);
            Root<LessonRequest> requestRoot = subquery.from(LessonRequest.class);

            subquery.where(builder.and(
                    builder.equal(requestRoot.get(LessonRequest.Fields.lesson), lessonRoot),
                    builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED)));

            Predicate predicate = builder.and(
                    builder.not(builder.exists(subquery)),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED),
                    builder.notEqual(lessonRoot.get(Lesson.Fields.status), Lesson.Status.COMPLETE),
                    builder.or(
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.OPEN),
                            builder.equal(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CLOSED)),
                    builder.lessThanOrEqualTo(lessonRoot.get(Lesson.Fields.endInstant), Instant.now()));

            entityManager.createQuery(
                    query.where(predicate).set(lessonRoot.get(Lesson.Fields.status), Lesson.Status.CANCELED))
                    .executeUpdate();
        }
    }
}
