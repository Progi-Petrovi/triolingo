package com.triolingo.controller;

import com.triolingo.entity.Teacher;
import com.triolingo.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<Teacher> listTeachers() {
        return teacherService.listAll();
    }

    @GetMapping("/{id}")
    public Teacher getTeacher(@PathVariable("id") Long id) {
        return teacherService.fetch(id);
    }

    @PostMapping
    //@Secured("ROLE_ADMIN")  change when authorization implemented
    public ResponseEntity<Teacher> createTeacher(@RequestBody Teacher teacher) {
        Teacher saved = teacherService.createTeacher(teacher);
        return ResponseEntity.created(URI.create("/teachers/" + saved.getId())).body(saved);
    }

    @PostMapping("/{id}")
    //@Secured("ROLE_ADMIN")
    public Teacher updateTeacher(@PathVariable("id") Long id, @RequestBody Teacher teacher) {
        if (!teacher.getId().equals(id))
            throw new IllegalArgumentException("Teacher Id is different");
        return teacherService.updateTeacher(teacher);
    }

    @DeleteMapping("/{id}")
    //@Secured("ROLE_ADMIN")
    public Teacher deleteTeacher(@PathVariable("id") Long id) {
        return teacherService.deleteTeacher(id);
    }

}
