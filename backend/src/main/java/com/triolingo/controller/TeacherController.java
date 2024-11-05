package com.triolingo.controller;

import com.triolingo.entity.Teacher;
import com.triolingo.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping("")
    public List<Teacher> listTeachers() {
        return teacherService.listAll();
    }

    @GetMapping("/{id}")
    public Teacher getTeacher(@PathVariable("id") Long id) {
        return teacherService.fetch(id);
    }

    //createTeacher

    //updateTeacher

    @DeleteMapping("/{id}")
    //@Secured("ROLE_ADMIN")
    public Teacher deleteTeacher(@PathVariable("id") Long id) {
        return teacherService.deleteTeacher(id);
    }


}
