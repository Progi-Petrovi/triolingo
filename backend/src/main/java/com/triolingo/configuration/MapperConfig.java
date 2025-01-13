package com.triolingo.configuration;

import java.util.Collection;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dtoMapper.DtoMapper;
import com.dtoMapper.TypeGetter;
import com.dtoMapper.TypeMapping;
import com.triolingo.entity.language.Language;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LanguageRepository;
import com.triolingo.repository.LessonRepository;
import com.triolingo.repository.StudentRepository;
import com.triolingo.repository.TeacherRepository;
import com.triolingo.repository.UserRepository;

@Configuration
public class MapperConfig {

    public final LanguageRepository languageRepository;
    public final TeacherRepository teacherRepository;
    public final StudentRepository studentRepository;
    public final UserRepository userRepository;
    public final LessonRepository lessonRepository;

    public MapperConfig(LanguageRepository languageRepository, TeacherRepository teacherRepository,
            StudentRepository studentRepository, UserRepository userRepository, LessonRepository lessonRepository) {
        this.languageRepository = languageRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    @Bean
    public DtoMapper getDtoMapper() {
        DtoMapper dtoMapper = new DtoMapper();

        dtoMapper.addTypeMapping(
                new TypeMapping<Collection<Language>, Collection<String>>(
                        this::languagesToStrings,
                        this::stringsToLanguages,
                        new TypeGetter<Collection<Language>>() {
                        }.getType(),
                        new TypeGetter<Collection<String>>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<Teacher, Long>(
                        this::teacherToLong,
                        this::longToTeacher,
                        new TypeGetter<Teacher>() {
                        }.getType(),
                        new TypeGetter<Long>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<Student, Long>(
                        this::studentToLong,
                        this::longToStudent,
                        new TypeGetter<Student>() {
                        }.getType(),
                        new TypeGetter<Long>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<Language, String>(
                        this::languageToString,
                        this::stringToLanguage,
                        new TypeGetter<Language>() {
                        }.getType(),
                        new TypeGetter<String>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<Lesson, Long>(
                        this::lessonToLong,
                        this::longToLesson,
                        new TypeGetter<Lesson>() {
                        }.getType(),
                        new TypeGetter<Long>() {
                        }.getType()));

        return dtoMapper;
    }

    private Collection<String> languagesToStrings(Collection<Language> languages) {
        return languages.stream()
                .map(language -> languageToString(language))
                .toList();
    }

    private Collection<Language> stringsToLanguages(Collection<String> languages) {
        return languages.stream()
                .map(languageName -> stringToLanguage(languageName))
                .toList();
    }

    private String languageToString(Language language) {
        return language.getName();
    }

    private Language stringToLanguage(String language) {
        return languageRepository.findByName(language).get();
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

    private Long lessonToLong(Lesson lesson) {
        return lesson.getId();
    }

    private Lesson longToLesson(Long id) {
        return lessonRepository.findById(id).get();
    }

}
