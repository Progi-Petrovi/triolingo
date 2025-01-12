package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.entity.user.Student;

import com.triolingo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.NoSuchElementException;

import com.triolingo.repository.StudentRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;
    private final UserRepository userRepository;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder, DtoMapper dtoMapper, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
        this.userRepository = userRepository;
    }

    public List<Student> listAll() {
        return studentRepository.findAll();
    }

    public Student fetch(Long id) {
        try {
            return studentRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Student with that id does not exist");
        }
    }

    public Student create(StudentCreateDTO studentDto) {
        if (userRepository.existsByEmail(studentDto.email()))
            throw new EntityExistsException("User with that email already exists");

        Student student = dtoMapper.createEntity(studentDto, Student.class);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }

    public void update(@NotNull Student student, @NotNull StudentCreateDTO studentDto) {
        dtoMapper.updateEntity(student, studentDto);
        if (studentDto.password() != null)
            student.setPassword(passwordEncoder.encode(student.getPassword()));

        studentRepository.save(student);
    }

    public void delete(@NotNull Student student) {
        studentRepository.delete(student);
    }

}
