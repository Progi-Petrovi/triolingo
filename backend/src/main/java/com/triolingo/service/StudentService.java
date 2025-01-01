package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.entity.user.Student;

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
    private final DtoMapper dtoMapper;

    public StudentService(StudentRepository studentRepository,
            DtoMapper dtoMapper) {
        this.studentRepository = studentRepository;
        this.dtoMapper = dtoMapper;
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

    public void create(StudentCreateDTO studentDto) {
        if (studentRepository.existsByEmail(studentDto.email()))
            throw new EntityExistsException("Student with that email already exists");
        studentRepository.save(dtoMapper.createEntity(studentDto, Student.class));
    }

    public void update(@NotNull Student student, @NotNull StudentCreateDTO studentDTO) {
        dtoMapper.updateEntity(student, studentDTO);
        studentRepository.save(student);
    }

    public void delete(@NotNull Student student) {
        studentRepository.delete(student);
    }

}
