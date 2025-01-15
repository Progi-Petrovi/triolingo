package com.triolingo.dto.admin;

public record AdminFullDTO(Long id,
        String email,
        String password,
        String fullName,
        Boolean verified,
        String profileImageHash) {
}
