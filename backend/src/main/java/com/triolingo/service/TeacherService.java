package com.triolingo.service;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.entity.Teacher;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import com.triolingo.repository.LanguageRepository;
import com.triolingo.repository.TeacherRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final LanguageRepository languageRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(TeacherRepository teacherRepository, LanguageRepository languageRepository,
            PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.languageRepository = languageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public Teacher fetch(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public void createTeacher(TeacherCreateDTO teacherDto) {
        if (teacherRepository.existsByEmail(teacherDto.email()))
            throw new EntityExistsException("Teacher with that email already exists");
        teacherRepository.save(teacherDto.transformIntoTeacher(languageRepository, passwordEncoder));
    }

    public void updateTeacher(@NotNull Long id, @NotNull TeacherCreateDTO teacherDTO) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        if (optionalTeacher.isEmpty())
            throw new EntityNotFoundException("Teacher with that Id does not exist.");

        Teacher teacher = optionalTeacher.get();
        teacherDTO.updateTeacher(teacher, languageRepository, passwordEncoder);
        teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = fetch(id);
        if (teacher == null)
            throw new EntityNotFoundException("Teacher with that Id does not exist.");
        teacherRepository.deleteById(id); // or .delete(teacher);
    }

}
