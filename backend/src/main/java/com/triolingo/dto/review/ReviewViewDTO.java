package com.triolingo.dto.review;

import java.time.Instant;

public record ReviewViewDTO(
    Long id,
    Long teacherId,
    Long studentId,
    Integer rating,
    String comment,
    Instant date) {
}
