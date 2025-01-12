package com.triolingo.dto.lesson;

import java.time.Instant;

public record LessonAvailabilityIntervalDTO(
        Instant startInstant, Instant endInstant) {

}
