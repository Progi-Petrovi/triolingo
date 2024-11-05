package com.triolingo.service;

import com.triolingo.entity.Teacher;
import com.triolingo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public Teacher fetch(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public Teacher createTeacher(Teacher teacher) {
        //validacija
        return teacherRepository.save(teacher);
    }

    public Teacher updateTeacher(Teacher teacher) {
        //validacija
        return teacherRepository.save(teacher);
    }

    public Teacher deleteTeacher(Long id) {
        Teacher teacher = fetch(id);
        teacherRepository.delete(teacher);
        return teacher;
    }
}
