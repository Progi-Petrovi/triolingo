package com.triolingo.dto.lesson;

import java.time.Instant;

public record LessonCreateDTO(
        Instant startInstant, Instant endInstant, String language) {

}
