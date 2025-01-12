package com.triolingo.service;

import com.triolingo.dto.lesson.LessonAvailabilityIntervalCreateDTO;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonAvailabilityInterval;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LessonAvailabilityIntervalRepository;
import com.triolingo.repository.LessonRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

import javax.validation.constraints.NotNull;

@Service
public class LessonService {
    private final LessonRepository lessonRepository;
    private final LessonAvailabilityIntervalRepository availabilityRepository;

    public LessonService(LessonRepository lessonRepository,
            LessonAvailabilityIntervalRepository availabilityRepository) {
        this.lessonRepository = lessonRepository;
        this.availabilityRepository = availabilityRepository;
    }

    public Lesson fetch(Long id) {
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

    public List<Lesson> findAllByStudent(@NotNull Student student) {
        return lessonRepository.findAllByStudent(student);
    }

    public List<LessonAvailabilityInterval> findAvailabilityByTeacher(@NotNull Teacher teacher) {
        return availabilityRepository.findAllByTeacher(teacher);
    }

    public LessonAvailabilityInterval createAvailabiltyInterval(@NotNull Teacher teacher,
            @NotNull LessonAvailabilityIntervalCreateDTO dto) {

        var startOverlap = availabilityRepository.findByInstantWithinInterval(dto.startInstant()).orElse(null);
        var endOverlap = availabilityRepository.findByInstantWithinInterval(dto.endInstant()).orElse(null);

        Instant startInstant = dto.startInstant();
        Instant endInstant = dto.endInstant();
        if (!startInstant.isBefore(endInstant))
            throw new IllegalArgumentException("Start instant must be set before the end instant");

        // if there is an interval that already contains the requested one, don't create
        // a new one
        if (startOverlap != null && endOverlap != null && startOverlap.getId().equals(endOverlap.getId())) {
            return startOverlap;
        } else {
            // if there is an interval that overlaps the start or end of the new interval,
            // join them by deleting the old interval and moving the start and/or end
            // instants of the new interval
            if (startOverlap != null) {
                startInstant = startOverlap.getStartInstant();
                availabilityRepository.delete(startOverlap);
            }
            if (endOverlap != null) {
                startInstant = endOverlap.getStartInstant();
                availabilityRepository.delete(endOverlap);
            }
        }

        // delete any intervals fully contained within the new interval
        availabilityRepository.deleteAllByStartDateBetween(startInstant, endInstant);

        var newAvailabilityInterval = new LessonAvailabilityInterval();
        newAvailabilityInterval.setStartInstant(startInstant);
        newAvailabilityInterval.setEndInstant(endInstant);
        availabilityRepository.save(newAvailabilityInterval);

        return newAvailabilityInterval;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void clearOldAvailabilityIntervals() {
        availabilityRepository.deleteAllByEndInstantGreaterThan(Instant.now());
    }
}
