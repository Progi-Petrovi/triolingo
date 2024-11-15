package com.triolingo.service;

import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.entity.Student;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import com.triolingo.repository.LanguageRepository;
import com.triolingo.repository.StudentRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final LanguageRepository languageRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, LanguageRepository languageRepository,
                          PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.languageRepository = languageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> listAll() {
        return studentRepository.findAll();
    }

    public Student fetch(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public void createStudent(StudentCreateDTO studentDto) {
        if (studentRepository.existsByEmail(studentDto.email()))
            throw new EntityExistsException("Student with that email already exists");
        studentRepository.save(studentDto.transformIntoStudent(languageRepository, passwordEncoder));
    }

    public void updateStudent(@NotNull Long id, @NotNull StudentCreateDTO studentDTO) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isEmpty())
            throw new EntityNotFoundException("Student with that Id does not exist.");

        Student student = optionalStudent.get();
        studentDTO.updateStudent(student, languageRepository, passwordEncoder);
        studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        Student student = fetch(id);
        if (student == null)
            throw new EntityNotFoundException("Student with that Id does not exist.");
        studentRepository.deleteById(id); // or .delete(student);
    }

}
