package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.lesson.*;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LessonRepository;
import com.triolingo.repository.LessonRequestRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

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
            return lesson;
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Lesson with that id does not exist");
        }
    }

    public Lesson fetchRequest(Long id) {
        try {
            Lesson lesson = lessonRepository.findById(id).get();
            return lesson;
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Lesson with that id does not exist");
        }
    }

    public List<Lesson> findAllByTeacher(@NotNull Teacher teacher) {
        return lessonRepository.findAllByTeacher(teacher);
    }

    public List<LessonRequest> findAllRequestsByTeacher(@NotNull Teacher teacher) {
        return lessonRequestRepository.findAllByTeacher(teacher);
    }

    public List<LessonRequest> findAllRequestsByLesson(@NotNull Lesson lesson) {
        return lessonRequestRepository.findAllByLesson(lesson);
    }

    public List<LessonRequest> findAllRequestsByStudent(@NotNull Student student) {
        return lessonRequestRepository.findAllByStudent(student);
    }

    public boolean requestExistsByTeacherAndStudentAndStatus(@NotNull Teacher teacher, @NotNull Student student,
            @NotNull LessonRequest.Status status) {
        return lessonRequestRepository.existsByTeacherAndStudentAndStatus(teacher, student, status);
    }

    public Lesson create(@NotNull Teacher teacher, @NotNull LessonCreateDTO dto) {
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
        return lesson;
    }

    public LessonRequest setRequestStatus(@NotNull LessonRequest request, @NotNull LessonRequest.Status status) {
        request.setStatus(status);
        lessonRequestRepository.save(request);
        return request;
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
    @Scheduled(cron = "0 */5 * * * *")
    public void cleanLessons() {
        for (Lesson lesson : lessonRepository.findAllByStatusAndEndInstantLessThan(
                Lesson.Status.CLOSED, Instant.now()))
            setStatus(lesson, Lesson.Status.COMPLETE);
        for (Lesson lesson : lessonRepository.findAllByStatusAndEndInstantLessThan(
                Lesson.Status.OPEN, Instant.now()))
            setStatus(lesson, Lesson.Status.COMPLETE);
    }
}
