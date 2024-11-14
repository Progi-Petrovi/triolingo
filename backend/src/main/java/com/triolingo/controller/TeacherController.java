package com.triolingo.controller;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherGetDTO;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.TeacherService;

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
@RequestMapping("/teacher")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<TeacherGetDTO> listTeachers() {
        return teacherService.listAll().stream().map(TeacherGetDTO::new).toList();
    }

    @GetMapping("/{id}")
    @Secured("ROLE_USER") // TODO: add ROLE_GUEST when guest is setup
    public TeacherGetDTO getTeacher(@PathVariable("id") Long id) {
        return new TeacherGetDTO(teacherService.fetch(id));
    }

    @PostMapping("/create")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreateDTO teacherDto) {
        try {
            teacherService.createTeacher(teacherDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerTeacher(@RequestBody TeacherCreateDTO teacherDto, HttpServletRequest request)
            throws ServletException {
        teacherService.createTeacher(teacherDto);
        request.login(teacherDto.email(), teacherDto.password());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody TeacherCreateDTO teacherDto) {
        try {
            teacherService.updateTeacher(id, teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    @Secured("ROLE_TEACHER")
    public ResponseEntity<?> updateTeacher(@RequestBody TeacherCreateDTO teacherDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            teacherService.updateTeacher(principal.getStoredUser().getId(), teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> deleteTeacher(@PathVariable("id") Long id) {
        try {
            teacherService.deleteTeacher(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
