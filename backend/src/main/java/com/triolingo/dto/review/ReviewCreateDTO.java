package com.triolingo.dto.review;

import java.time.Instant;

public record ReviewCreateDTO (
    Long teacherId,
    Long studentId,
    Integer rating,
    String comment,
    Instant date) {
}
