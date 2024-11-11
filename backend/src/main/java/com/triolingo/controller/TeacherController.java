package com.triolingo.controller;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherGetDTO;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.TeacherService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<TeacherGetDTO> listTeachers() {
        return teacherService.listAll().stream().map(TeacherGetDTO::new).toList();
    }

    @GetMapping("/get/{id}")
    @Secured("ROLE_USER") // TODO: add ROLE_GUEST when guest is setup
    public TeacherGetDTO getTeacher(@PathVariable("id") Long id) {
        return new TeacherGetDTO(teacherService.fetch(id));
    }

    @PostMapping("/create")
    // @Secured("ROLE_ADMIN") // TODO: add when ADMIN is setup
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreateDTO teacherDto) {
        teacherService.createTeacher(teacherDto);
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
            teacherService.updateTeacher(principal.storedUser.getId(), teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
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
