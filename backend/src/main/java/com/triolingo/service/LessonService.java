package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.aggregate.LessonAggregate;
import com.triolingo.aggregate.LessonBulkAggregate;
import com.triolingo.aggregate.LessonRequestAggregate;
import com.triolingo.aggregate.LessonRequestBulkAggregate;
import com.triolingo.dto.lesson.*;
import com.triolingo.dto.student.StudentViewDTO;
import com.triolingo.dto.teacher.TeacherViewDTO;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LessonRepository;
import com.triolingo.repository.LessonRequestRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import javax.validation.constraints.NotNull;

@Service
@Transactional
public class LessonService {
    private final LessonRepository lessonRepository;
    private final LessonRequestRepository lessonRequestRepository;
    private final DtoMapper dtoMapper;

    public LessonService(LessonRepository lessonRepository, LessonRequestRepository lessonRequestRepository,
            DtoMapper dtoMapper) {
        this.lessonRepository = lessonRepository;
        this.lessonRequestRepository = lessonRequestRepository;
        this.dtoMapper = dtoMapper;
    }

    public Lesson fetch(Long id) {
        try {
            Lesson lesson = lessonRepository.findById(id).get();
            lessonRepository.updateStatusIfExpired(Collections.singletonList(lesson));
            return lessonRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Lesson with that id does not exist");
        }
    }

    public LessonRequest fetchRequest(Long id) {
        try {
            LessonRequest request = lessonRequestRepository.findById(id).get();
            lessonRepository.updateStatusIfExpired(Collections.singletonList(request.getLesson()));
            request.setLesson(lessonRepository.findById(request.getLesson().getId()).get());
            return request;
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Lesson request with that id does not exist");
        }
    }

    public List<Lesson> findAllByTeacher(@NotNull Teacher teacher) {
        lessonRepository.updateAllStatusIfExpired();
        List<Lesson> lessons = lessonRepository.findAllByTeacher(teacher);
        return lessons;
    }

    public List<Lesson> findAllByTeacherAndStatus(@NotNull Teacher teacher, @NotNull Lesson.Status status) {
        lessonRepository.updateAllStatusIfExpired();
        List<Lesson> lessons = lessonRepository.findAllByTeacherAndStatus(teacher, status);
        return lessons;
    }

    public List<Lesson> findAllByStudent(@NotNull Student student) {
        lessonRepository.updateAllStatusIfExpired();
        List<Lesson> lessons = lessonRepository.findAllByStudent(student);
        return lessons;
    }

    public List<LessonRequest> findAllRequestsByTeacher(@NotNull Teacher teacher) {
        lessonRepository.updateAllStatusIfExpired();
        return lessonRequestRepository.findAllByTeacher(teacher);
    }

    public List<LessonRequest> findAllRequestsByLesson(@NotNull Lesson lesson) {
        lessonRepository.updateAllStatusIfExpired();
        return lessonRequestRepository.findAllByLesson(lesson);
    }

    public List<LessonRequest> findAllRequestsByStudent(@NotNull Student student) {
        lessonRepository.updateAllStatusIfExpired();
        return lessonRequestRepository.findAllByStudent(student);
    }

    public boolean requestExistsByTeacherAndStudentAndStatus(@NotNull Teacher teacher, @NotNull Student student,
            @NotNull LessonRequest.Status status) {
        return lessonRequestRepository.existsByTeacherAndStudentAndStatus(teacher, student, status);
    }

    public Lesson create(@NotNull Teacher teacher, @NotNull LessonCreateDTO dto) {
        lessonRepository.updateAllStatusIfExpired();
        Lesson lesson = dtoMapper.createEntity(dto, Lesson.class);
        if (!lesson.getStartInstant().isBefore(lesson.getEndInstant()))
            throw new IllegalArgumentException(
                    "Start time must be before end time");
        if (Instant.now().isAfter(lesson.getStartInstant()))
            throw new IllegalArgumentException(
                    "Cannot create lessons in the past");
        if (!teacher.getLanguages().contains(lesson.getLanguage()))
            throw new IllegalArgumentException(
                    "Teachers are not allowed to create lessons for languages they do not teach");
        if (lessonRepository.existsByTeacherAndInstantOverlap(
                teacher, lesson.getStartInstant(), lesson.getEndInstant()))
            throw new IllegalArgumentException(
                    "Lesson time overlaps with existing active lesson");
        lesson.setTeacher(teacher);
        lesson.setStatus(Lesson.Status.OPEN);
        lesson.setTeacherPayment(
                Duration.between(
                        lesson.getStartInstant(), lesson.getEndInstant())
                        .toMinutes() / 60.0 * teacher.getHourlyRate());
        lessonRepository.save(lesson);
        return lesson;
    }

    public Lesson setStatus(Lesson lesson, Lesson.Status status) {
        // If lesson is closed or complete, reject all pending requests
        // If lesson is canceled, reject all requests
        if (status == Lesson.Status.CLOSED || status == Lesson.Status.COMPLETE) {
            List<LessonRequest> requests = findAllRequestsByLesson(lesson);
            for (LessonRequest request : requests)
                if (request.getStatus() == LessonRequest.Status.PENDING)
                    request.setStatus(LessonRequest.Status.REJECTED);
            lessonRequestRepository.saveAll(requests);
        } else if (status == Lesson.Status.CANCELED) {
            List<LessonRequest> requests = findAllRequestsByLesson(lesson);
            for (LessonRequest request : requests)
                request.setStatus(LessonRequest.Status.REJECTED);
            lessonRequestRepository.saveAll(requests);
        }

        lesson.setStatus(status);
        lessonRepository.save(lesson);
        lessonRepository.updateStatusIfExpired(Collections.singletonList(lesson));
        return lessonRepository.findById(lesson.getId()).get();
    }

    public void setRequestStatus(@NotNull LessonRequest request, @NotNull LessonRequest.Status status) {
        request.setStatus(status);
        if (status == LessonRequest.Status.REJECTED) {
            lessonRequestRepository.delete(request);
            return;
        }
        lessonRequestRepository.save(request);

        // If teaching style is individual and a request is accepted, close the lesson
        // and reject other pending requests.
        if (status == LessonRequest.Status.ACCEPTED
                && request.getLesson().getTeacher().getTeachingStyle() == TeachingStyle.INDIVIDUAL) {
            Lesson lesson = request.getLesson();
            lesson.setStatus(Lesson.Status.CLOSED);
            List<LessonRequest> requests = findAllRequestsByLesson(lesson);
            for (LessonRequest otherRequest : requests)
                if (otherRequest.getStatus() == LessonRequest.Status.PENDING)
                    otherRequest.setStatus(LessonRequest.Status.REJECTED);
            lessonRequestRepository.saveAll(requests);
            lessonRepository.save(lesson);
        }
    }

    public LessonRequest createRequest(@NotNull Student student, @NotNull Lesson lesson) {
        if (lesson.getStatus() != Lesson.Status.OPEN)
            throw new IllegalArgumentException("Lesson is not open to new requests");
        if (lessonRequestRepository.existsByStudentAndLessonAndStatus(student, lesson, LessonRequest.Status.ACCEPTED))
            throw new IllegalArgumentException("Lesson request for this lesson has already been accepted");
        if (lessonRequestRepository.existsByStudentAndLessonAndStatus(student, lesson, LessonRequest.Status.PENDING))
            throw new IllegalArgumentException("Lesson request for this lesson is still pending");

        LessonRequest request = new LessonRequest();
        request.setLesson(lesson);
        request.setStudent(student);
        request.setStatus(LessonRequest.Status.PENDING);
        lessonRequestRepository.save(request);
        return request;
    }

    // Completes lessons with and end instant that has passed
    @Scheduled(cron = "0 */10 * * * *")
    public void cleanLessons() {
        lessonRepository.updateAllStatusIfExpired();
    }

    public LessonAggregate generateAggregate(Lesson lesson) {
        return new LessonAggregate(
                dtoMapper.createDto(lesson, LessonViewDTO.class),
                dtoMapper.createDto(lesson.getTeacher(), TeacherViewDTO.class));
    }

    public LessonRequestAggregate generateRequestAggregate(LessonRequest request) {
        return new LessonRequestAggregate(
                dtoMapper.createDto((request), LessonRequestViewDTO.class),
                generateAggregate(request.getLesson()),
                dtoMapper.createDto(request.getStudent(), StudentViewDTO.class));
    }

    public LessonBulkAggregate generateBulkAggregate(Collection<Lesson> lessons) {
        Set<Teacher> teachers = new HashSet<>();

        for (Lesson lesson : lessons)
            teachers.add(lesson.getTeacher());

        return new LessonBulkAggregate(
                lessons.stream().map(lesson -> dtoMapper.createDto(lesson, LessonViewDTO.class)).toList(),
                teachers.stream().map(teacher -> dtoMapper.createDto(teacher, TeacherViewDTO.class)).toList());
    }

    public LessonRequestBulkAggregate generateRequestBulkAggregate(Collection<LessonRequest> requests) {
        Set<Student> students = new HashSet<>();
        Set<Lesson> lessons = new HashSet<>();

        for (LessonRequest request : requests) {
            lessons.add(request.getLesson());
            students.add(request.getStudent());
        }

        return new LessonRequestBulkAggregate(
                requests.stream().map(request -> dtoMapper.createDto(request, LessonRequestViewDTO.class)).toList(),
                generateBulkAggregate(lessons),
                students.stream().map(student -> dtoMapper.createDto(student, StudentViewDTO.class)).toList());
    }
}
