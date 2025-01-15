package com.triolingo.service;

import com.triolingo.entity.user.Admin;
import com.triolingo.repository.AdminRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin fetch(Long id) {
        try {
            return adminRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Admin with id " + id + " not found");
        }
    }
}
