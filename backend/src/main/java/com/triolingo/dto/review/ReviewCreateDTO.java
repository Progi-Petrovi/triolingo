package com.triolingo.dto.review;

import java.time.Instant;

public record ReviewCreateDTO(
        Long teacher,
        Integer rating,
        String content,
        Instant date) {
}
