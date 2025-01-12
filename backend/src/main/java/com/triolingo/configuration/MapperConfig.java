package com.triolingo.configuration;

import java.util.Collection;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dtoMapper.DtoMapper;
import com.dtoMapper.TypeGetter;
import com.dtoMapper.TypeMapping;
import com.triolingo.entity.language.Language;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LanguageRepository;
import com.triolingo.repository.StudentRepository;
import com.triolingo.repository.TeacherRepository;
import com.triolingo.repository.UserRepository;

@Configuration
public class MapperConfig {

    public final LanguageRepository languageRepository;
    public final TeacherRepository teacherRepository;
    public final StudentRepository studentRepository;
    public final UserRepository userRepository;

    public MapperConfig(LanguageRepository languageRepository, TeacherRepository teacherRepository,
            StudentRepository studentRepository, UserRepository userRepository) {
        this.languageRepository = languageRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @Bean
    public DtoMapper getDtoMapper() {
        DtoMapper dtoMapper = new DtoMapper();

        dtoMapper.addTypeMapping(
                new TypeMapping<Collection<Language>, Collection<String>>(
                        this::languagesToString,
                        this::stringToLanguages,
                        new TypeGetter<Collection<Language>>() {
                        }.getType(),
                        new TypeGetter<Collection<String>>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<Teacher, Long>(
                        this::teacherToLong,
                        this::longToTeacher,
                        new TypeGetter<Collection<Teacher>>() {
                        }.getType(),
                        new TypeGetter<Collection<Long>>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<Student, Long>(
                        this::studentToLong,
                        this::longToStudent,
                        new TypeGetter<Collection<Student>>() {
                        }.getType(),
                        new TypeGetter<Collection<Long>>() {
                        }.getType()));

        return dtoMapper;
    }

    private Collection<String> languagesToString(Collection<Language> languages) {
        return languages.stream()
                .map(language -> language.getName())
                .toList();
    }

    private Collection<Language> stringToLanguages(Collection<String> languages) {
        return languages.stream()
                .map(languageName -> languageRepository.findByName(languageName).get())
                .toList();
    }

    private Long teacherToLong(Teacher teacher) {
        return teacher.getId();
    }

    private Teacher longToTeacher(Long id) {
        return teacherRepository.findById(id).get();
    }

    private Long studentToLong(Student student) {
        return student.getId();
    }

    private Student longToStudent(Long id) {
        return studentRepository.findById(id).get();
    }

}
