package com.triolingo.service;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.entity.Teacher;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import com.triolingo.repository.TeacherRepository;

import jakarta.persistence.EntityNotFoundException;

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

    public Teacher createTeacher(TeacherCreateDTO teacherDto) {
        return teacherRepository.save(teacherDto.transformIntoTeacher());
    }

    public Teacher updateTeacher(@NotNull Long id, @NotNull TeacherCreateDTO teacherDTO) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        if (optionalTeacher.isEmpty())
            throw new EntityNotFoundException("Teacher with that Id does not exist.");

        Teacher teacher = optionalTeacher.get();
        teacherDTO.updateTeacher(teacher);
        return teacherRepository.save(teacher);
    }

    public Teacher deleteTeacher(Long id) {
        Teacher teacher = fetch(id);
        if (teacher == null)
            throw new EntityNotFoundException("Teacher with that Id does not exist.");
        teacherRepository.deleteById(id); // or .delete(teacher);
        return teacher;
    }

}
