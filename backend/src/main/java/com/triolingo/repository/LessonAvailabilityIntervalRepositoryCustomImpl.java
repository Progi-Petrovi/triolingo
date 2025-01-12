package com.triolingo.repository;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import com.triolingo.entity.lesson.LessonAvailabilityInterval;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class LessonAvailabilityIntervalRepositoryCustomImpl implements LessonAvailabilityIntervalRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public Optional<LessonAvailabilityInterval> findByInstantWithinInterval(Instant instant) {

        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LessonAvailabilityInterval> query = builder.createQuery(LessonAvailabilityInterval.class);

        Root<LessonAvailabilityInterval> intervalRoot = query.from(LessonAvailabilityInterval.class);

        Predicate predicate = builder.and(
                builder.lessThanOrEqualTo(intervalRoot.get(LessonAvailabilityInterval.Fields.startInstant), instant),
                builder.greaterThanOrEqualTo(intervalRoot.get(LessonAvailabilityInterval.Fields.endInstant),
                        instant));

        List<LessonAvailabilityInterval> results = entityManager.createQuery(query.where(predicate)).getResultList();
        try {
            return Optional.of(results.getFirst());
        } catch (NoSuchElementException e) {
            return Optional.empty();
        }
    }
}
