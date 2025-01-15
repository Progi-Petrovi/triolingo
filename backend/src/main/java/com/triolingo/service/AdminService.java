package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.entity.user.Admin;
import com.triolingo.entity.user.User;
import com.triolingo.repository.AdminRepository;
import com.triolingo.repository.TeacherRepository;
import com.triolingo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;
    private final Environment env;
    private final UserRepository userRepository;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder, DtoMapper dtoMapper,
                        Environment env, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
        this.env = env;
        this.userRepository = userRepository;
    }

    public Admin fetch(Long id) {
        try {
            return adminRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Admin with id " + id + " not found");
        }
    }
}
