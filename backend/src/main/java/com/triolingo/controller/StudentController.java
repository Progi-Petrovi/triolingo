package com.triolingo.controller;

import com.triolingo.entity.Student;
import com.triolingo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    //@Secured("ROLE_ADMIN")  change when authorization implemented
    public List<Student> listStudents() {
        return studentService.listAll();
    }

    @GetMapping("/{id}")
    //@Secured("ROLE_ADMIN")
    public Student getStudent(@PathVariable("id") Long id) {
        return studentService.fetch(id);
    }

    @PostMapping
    //@Secured("ROLE_ADMIN")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        Student saved = studentService.createStudent(student);
        return ResponseEntity.created(URI.create("/students/" + saved.getId())).body(saved);
    }

    @PostMapping("/{id}")
    //@Secured("ROLE_ADMIN")
    public Student updateStudent(@PathVariable("id") Long id, @RequestBody Student student) {
        if (!student.getId().equals(id))
            throw new IllegalArgumentException("student Id is different");
        return studentService.updateStudent(student);
    }

    @DeleteMapping("/{id}")
    //@Secured("ROLE_ADMIN")
    public Student deleteStudent(@PathVariable("id") Long id) {
        return studentService.deleteStudent(id);
    }


}
