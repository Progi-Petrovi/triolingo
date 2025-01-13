package com.triolingo.dto.review;

import java.time.Instant;

public record ReviewSendDTO(
        Long id,
        Long teacherId,
        String studentName,
        Integer rating,
        String content,
        Instant date) {
}