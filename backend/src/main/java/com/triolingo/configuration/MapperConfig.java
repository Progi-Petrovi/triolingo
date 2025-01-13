package com.triolingo.configuration;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

import com.triolingo.entity.language.KnowledgeLevel;
import com.triolingo.entity.language.LearningLanguage;
import com.triolingo.repository.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dtoMapper.DtoMapper;
import com.dtoMapper.TypeGetter;
import com.dtoMapper.TypeMapping;
import com.triolingo.entity.language.Language;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;

@Configuration
public class MapperConfig {

    public final LanguageRepository languageRepository;
    public final TeacherRepository teacherRepository;
    public final StudentRepository studentRepository;
    public final UserRepository userRepository;
    public final LessonRepository lessonRepository;
    private final LearningLanguageRepository learningLanguageRepository;

    public MapperConfig(LanguageRepository languageRepository, TeacherRepository teacherRepository,
                        StudentRepository studentRepository, UserRepository userRepository, LessonRepository lessonRepository, LearningLanguageRepository learningLanguageRepository) {
        this.languageRepository = languageRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.learningLanguageRepository = learningLanguageRepository;
    }

    @Bean
    public DtoMapper getDtoMapper() {
        DtoMapper dtoMapper = new DtoMapper();

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::languagesToStrings,
                        this::stringsToLanguages,
                        new TypeGetter<Collection<Language>>() {
                        }.getType(),
                        new TypeGetter<Collection<String>>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::teacherToLong,
                        this::longToTeacher,
                        new TypeGetter<Teacher>() {
                        }.getType(),
                        new TypeGetter<Long>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::studentToLong,
                        this::longToStudent,
                        new TypeGetter<Student>() {
                        }.getType(),
                        new TypeGetter<Long>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::languageToString,
                        this::stringToLanguage,
                        new TypeGetter<Language>() {
                        }.getType(),
                        new TypeGetter<String>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::lessonToLong,
                        this::longToLesson,
                        new TypeGetter<Lesson>() {
                        }.getType(),
                        new TypeGetter<Long>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::studentToName,
                        this::nameToStudent,
                        new TypeGetter<Student>() {
                        }.getType(),
                        new TypeGetter<String>() {
                        }.getType()));

        dtoMapper.addTypeMapping(
                new TypeMapping<>(
                        this::learningLanguageToMap,
                        this::mapToLearningLanguage,
                        new TypeGetter<Collection<LearningLanguage>>() {
                        }.getType(),
                        new TypeGetter<Map<String, KnowledgeLevel>>() {
                        }.getType()));

        return dtoMapper;
    }

    private Collection<String> languagesToStrings(Collection<Language> languages) {
        return languages.stream()
                .map(this::languageToString)
                .toList();
    }

    private Collection<Language> stringsToLanguages(Collection<String> languages) {
        return languages.stream()
                .map(this::stringToLanguage)
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

    private String studentToName(Student student) {
        return student.getFullName();
    }

    private Student nameToStudent(String name) {
        throw new UnsupportedOperationException("Field mapping not supported.");
    }

    private Collection<LearningLanguage> mapToLearningLanguage(Map<String, KnowledgeLevel> language) {
        return language.entrySet().stream().map(lang -> {
            Language language1 = stringToLanguage(lang.getKey());
            return learningLanguageRepository.findByLanguageAndKnowledgeLevel(language1, lang.getValue()).orElse(
                    learningLanguageRepository.save(new LearningLanguage(language1, lang.getValue()))
            );
        }).toList();
    }

    private Map<String, KnowledgeLevel> learningLanguageToMap(Collection<LearningLanguage> learningLanguages) {
        return
                learningLanguages.stream().collect(Collectors.toMap((learningLanguage -> learningLanguage.getLanguage().getName()), LearningLanguage::getKnowledgeLevel));
    }

}
