package com.triolingo.dto.review;

import javax.validation.constraints.NotNull;
import java.time.Instant;

public record ReviewViewDTO(
    Long id,
    Long teacherId,
    Long studentId,
    Integer rating,
    String content,
    Instant date) {
}
