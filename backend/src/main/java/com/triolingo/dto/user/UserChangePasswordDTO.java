package com.triolingo.dto.user;

public record UserChangePasswordDTO(
        String oldPassword,
        String newPassword
) {
}
