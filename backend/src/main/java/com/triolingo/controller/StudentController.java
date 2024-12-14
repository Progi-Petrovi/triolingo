package com.triolingo.controller;

import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.dto.student.StudentGetDTO;
import com.triolingo.dto.student.StudentTranslator;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.StudentService;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;
    private final StudentTranslator studentTranslator;

    public StudentController(StudentService studentService, StudentTranslator studentTranslator) {
        this.studentService = studentService;
        this.studentTranslator = studentTranslator;
    }

    @GetMapping
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public List<StudentGetDTO> listStudents() {
        return studentService.listAll().stream().map(student -> studentTranslator.toDTO(student)).toList();
    }

    @GetMapping("/{id}")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public StudentGetDTO getStudent(@PathVariable("id") Long id) {
        return studentTranslator.toDTO(studentService.fetch(id));
    }

    @PostMapping("/create")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> createStudent(@RequestBody StudentCreateDTO studentDto) {
        try {
            studentService.createStudent(studentDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody StudentCreateDTO studentDto, HttpServletRequest request)
            throws ServletException {
        studentService.createStudent(studentDto);
        request.login(studentDto.email(), studentDto.password());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> updateStudent(@PathVariable("id") Long id, @RequestBody StudentCreateDTO studentDto) {
        try {
            studentService.updateStudent(id, studentDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    @Secured("ROLE_STUDENT")
    public ResponseEntity<?> updateStudent(@RequestBody StudentCreateDTO studentDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            studentService.updateStudent(principal.getStoredUser().getId(), studentDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> deleteStudent(@PathVariable("id") Long id) {
        try {
            studentService.deleteStudent(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
