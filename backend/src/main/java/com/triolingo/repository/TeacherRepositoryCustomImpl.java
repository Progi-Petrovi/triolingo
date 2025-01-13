package com.triolingo.repository;

import java.util.List;

import com.triolingo.dto.teacher.TeacherFilterDTO;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.Language;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Teacher;
import com.triolingo.entity.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class TeacherRepositoryCustomImpl implements TeacherRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Teacher> listAll(List<String> languages, Integer minYearsOfExperience, Integer maxYearsOfExperience,
            List<TeachingStyle> teachingStyles, Double minHourlyRate, Double maxHourlyRate,
            TeacherFilterDTO.Order order) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Teacher> query = builder.createQuery(Teacher.class);

        Root<Teacher> teacherRoot = query.from(Teacher.class);
        Join<Teacher, Language> languageJoin = teacherRoot.join(Teacher.Fields.languages);

        Predicate predicate = builder.and();
        if (minHourlyRate != null)
            predicate = builder.and(predicate,
                    builder.greaterThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.hourlyRate),
                            minHourlyRate));
        if (maxHourlyRate != null)
            predicate = builder.and(predicate,
                    builder.lessThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.hourlyRate),
                            maxHourlyRate));

        if (minYearsOfExperience != null)
            predicate = builder.and(predicate,
                    builder.greaterThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.yearsOfExperience),
                            minYearsOfExperience));
        if (maxYearsOfExperience != null)
            predicate = builder.and(predicate,
                    builder.lessThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.yearsOfExperience),
                            maxYearsOfExperience));

        if (teachingStyles != null)
            predicate = builder.and(predicate,
                    teacherRoot.get(Teacher.Fields.teachingStyle)
                            .in(teachingStyles));

        if (languages != null)
            predicate = builder.and(predicate,
                    languageJoin.get(Language.Fields.name)
                            .in(languages));

        query = query.where(predicate).groupBy(teacherRoot.get(User.Fields.id));

        if (languages != null)
            query = query.having(builder.equal(builder.count(teacherRoot), languages.size()));

        Order queryOrder = builder.desc(teacherRoot.get(User.Fields.fullName));
        if (order != null)
            switch (order) {
                case TeacherFilterDTO.Order.ALPHABETICAL_DESC:
                    queryOrder = builder.desc(teacherRoot.get(User.Fields.fullName));
                    break;
                case TeacherFilterDTO.Order.ALPHABETICAL_ASC:
                    queryOrder = builder.asc(teacherRoot.get(User.Fields.fullName));
                    break;
                case TeacherFilterDTO.Order.YEARS_OF_EXPERIANCE_DESC:
                    queryOrder = builder.desc(teacherRoot.get(Teacher.Fields.yearsOfExperience));
                    break;
                case TeacherFilterDTO.Order.YEARS_OF_EXPERIANCE_ASC:
                    queryOrder = builder.asc(teacherRoot.get(Teacher.Fields.yearsOfExperience));
                    break;
                case TeacherFilterDTO.Order.HOURLY_RATE_DESC:
                    queryOrder = builder.desc(teacherRoot.get(Teacher.Fields.hourlyRate));
                    break;
                case TeacherFilterDTO.Order.HOURLY_RATE_ASC:
                    queryOrder = builder.asc(teacherRoot.get(Teacher.Fields.hourlyRate));
                    break;
                default:
                    break;
            }

        return entityManager.createQuery(query.orderBy(queryOrder)).getResultList();
    }

    @Override
    public int countUniqueStudentsWithLessonsWithTeacher(Teacher teacher) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LessonRequest> query = builder.createQuery(LessonRequest.class);

        Root<LessonRequest> requestRoot = query.from(LessonRequest.class);
        Join<LessonRequest, Lesson> lessonJoin = requestRoot.join(LessonRequest.Fields.lesson);

        Predicate predicate = builder.and(
                builder.equal(lessonJoin.get(Lesson.Fields.teacher), teacher),
                builder.equal(requestRoot.get(LessonRequest.Fields.status), LessonRequest.Status.ACCEPTED),
                builder.equal(lessonJoin.get(Lesson.Fields.status), Lesson.Status.COMPLETE));

        query = query
                .where(predicate)
                .groupBy(requestRoot.get(LessonRequest.Fields.student));
        return entityManager.createQuery(query).getResultList().size();
    }
}
