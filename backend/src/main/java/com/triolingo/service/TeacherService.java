package com.triolingo.service;

import com.triolingo.entity.Teacher;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;

import com.triolingo.repository.TeacherRepository;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public Teacher fetch(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public Teacher createTeacher(Teacher teacher) {
        if (teacher.getId() == null)
            return teacherRepository.save(teacher);
        else
            throw new IllegalArgumentException("Teacher cannot have Id yet");
    }

    public Teacher updateTeacher(@NotNull Teacher teacher) {
        if (teacherRepository.existsById(teacher.getId()))
            return teacherRepository.save(teacher);
        else
            throw new IllegalArgumentException("Teacher with that Id does not exist");
    }

    public Teacher deleteTeacher(Long id) {
        Teacher teacher = fetch(id);
        if (teacher == null)
            throw new IllegalArgumentException("Teacher with that Id does not exist");
        teacherRepository.deleteById(id); // or .delete(teacher);
        return teacher;
    }

}
