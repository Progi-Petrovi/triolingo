package com.triolingo.service;

import com.triolingo.dto.user.UserChangePasswordDTO;
import com.triolingo.entity.user.Teacher;
import com.triolingo.entity.user.User;
import com.triolingo.exception.ChangePasswordException;
import com.triolingo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.NoSuchElementException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void changePassword(@NotNull User user, @NotNull UserChangePasswordDTO userChangePasswordDTO) {
        if (!passwordEncoder.matches(userChangePasswordDTO.oldPassword(), user.getPassword())) {
            throw new ChangePasswordException("Old password is incorrect.");
        }

        if (passwordEncoder.matches(userChangePasswordDTO.newPassword(), user.getPassword())) {
            throw new ChangePasswordException("New password is same as the old password.");
        }

        user.setPassword(passwordEncoder.encode(userChangePasswordDTO.newPassword()));
        userRepository.save(user);
    }

    public User fetch(Long id) {
        try {
            return userRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("User with that id does not exist");
        }
    }
}
