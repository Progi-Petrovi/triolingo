package com.triolingo.service;

import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.dto.student.StudentTranslator;
import com.triolingo.entity.Student;

import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import com.triolingo.repository.StudentRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentTranslator studentTranslator;

    public StudentService(StudentRepository studentRepository,
            StudentTranslator studentTranslator) {
        this.studentRepository = studentRepository;
        this.studentTranslator = studentTranslator;
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
        studentRepository.save(studentTranslator.fromDTO(studentDto));
    }

    public void updateStudent(@NotNull Long id, @NotNull StudentCreateDTO studentDTO) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isEmpty())
            throw new EntityNotFoundException("Student with that Id does not exist.");

        Student student = optionalStudent.get();
        studentTranslator.updateStudent(student, studentDTO);
        studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        Student student = fetch(id);
        if (student == null)
            throw new EntityNotFoundException("Student with that Id does not exist.");
        studentRepository.deleteById(id);
    }

}
