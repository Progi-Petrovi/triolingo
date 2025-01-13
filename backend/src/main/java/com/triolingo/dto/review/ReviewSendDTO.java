package com.triolingo.dto.review;

import java.time.Instant;

public record ReviewSendDTO(
        Long id,
        Long teacher,
        String student,
        Integer rating,
        String content,
        Instant date) {
}