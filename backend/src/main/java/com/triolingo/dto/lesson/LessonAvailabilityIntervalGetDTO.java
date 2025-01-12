package com.triolingo.dto.lesson;

import java.time.Instant;

public record LessonAvailabilityIntervalGetDTO(
        Long id,
        Instant startInstant, Instant endInstant) {

}
