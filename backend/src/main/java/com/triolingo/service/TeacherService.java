package com.triolingo.service;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherTranslator;
import com.triolingo.entity.Teacher;
import com.triolingo.repository.TeacherRepository;

import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherTranslator teacherTranslator;

    public TeacherService(TeacherRepository teacherRepository, TeacherTranslator teacherTranslator) {
        this.teacherRepository = teacherRepository;
        this.teacherTranslator = teacherTranslator;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public Teacher fetch(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public Teacher createTeacher(TeacherCreateDTO teacherDto) {
        if (teacherRepository.existsByEmail(teacherDto.email()))
            throw new EntityExistsException("Teacher with that email already exists");
        return teacherRepository.save(teacherTranslator.fromDTO(teacherDto));
    }

    public Teacher updateTeacher(@NotNull Long id, @NotNull TeacherCreateDTO teacherDTO) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        if (optionalTeacher.isEmpty())
            throw new EntityNotFoundException("Teacher with that Id does not exist.");

        Teacher teacher = optionalTeacher.get();
        teacherTranslator.updateTeacher(teacher, teacherDTO);
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = fetch(id);
        if (teacher == null)
            throw new EntityNotFoundException("Teacher with that Id does not exist.");
        teacherRepository.deleteById(id); // or .delete(teacher);
    }

}
