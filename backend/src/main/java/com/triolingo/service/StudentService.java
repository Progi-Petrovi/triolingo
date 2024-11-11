package com.triolingo.service;

import com.triolingo.entity.Student;
import com.triolingo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> listAll() {
        return studentRepository.findAll();
    }

    public Student fetch(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student createStudent(Student student) {
        if (student.getId() == null)
            return studentRepository.save(student);
        else
            throw new IllegalArgumentException("Student cannot have Id yet");
    }

    public Student updateStudent(@NotNull Student student) {
        if (studentRepository.existsById(student.getId()))
            return studentRepository.save(student);
        else
            throw new IllegalArgumentException("Student with that Id does not exist");
    }

    public Student deleteStudent(Long id) {
        Student student = fetch(id);
        if (student == null)
            throw new IllegalArgumentException("Student with that Id does not exist");
        studentRepository.delete(student);
        return student;
    }
}

