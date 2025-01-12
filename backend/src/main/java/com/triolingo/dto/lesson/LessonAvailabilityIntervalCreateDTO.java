package com.triolingo.dto.lesson;

import java.time.Instant;

public record LessonAvailabilityIntervalCreateDTO(
        Instant startInstant, Instant endInstant) {

}
