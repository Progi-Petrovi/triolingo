package com.dtoMapper;

import java.util.Arrays;
import java.util.Collection;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogManager;
import java.util.logging.Logger;

import com.triolingo.dto.teacher.TeacherViewDTO;
import com.triolingo.entity.language.Language;
import com.triolingo.entity.user.Teacher;

public class MapperTest {

    public static void main(String[] args) {

        Logger rootLogger = LogManager.getLogManager().getLogger("");
        rootLogger.setLevel(Level.FINE);
        for (Handler h : rootLogger.getHandlers()) {
            h.setLevel(Level.FINE);
        }

        Teacher teacher = Teacher.builder()
                .email("testmail").fullName("test test").languages(Arrays.asList(new Language(1L, "English"))).build();

        DtoMapper dtoMapper = new DtoMapper();

        TypeMapping<Collection<Language>, Collection<String>> typeMapping = new TypeMapping<Collection<Language>, Collection<String>>(
                MapperTest::languagesToString,
                MapperTest::stringToLanguages,
                new TypeGetter<Collection<Language>>() {
                }.getType(),
                new TypeGetter<Collection<String>>() {
                }.getType());

        dtoMapper.addTypeMapping(typeMapping);

        TeacherViewDTO dto = dtoMapper.createDto(teacher, TeacherViewDTO.class);
        System.out.println(dto);

        Teacher teacher2 = dtoMapper.createEntity(dto, Teacher.class);
        TeacherViewDTO dto2 = dtoMapper.createDto(teacher2, TeacherViewDTO.class);
        System.out.println(dto2);

        TeacherViewDTO dto3 = new TeacherViewDTO(null, "test test test", null, null, null, null, null, null);
        System.out.println(dto3);

        dtoMapper.updateEntity(teacher2, dto3);
        TeacherViewDTO dto4 = dtoMapper.createDto(teacher2, TeacherViewDTO.class);
        System.out.println(dto4);
    }

    private static Collection<String> languagesToString(Collection<Language> languages) {
        return languages.stream()
                .map(language -> language.getName())
                .toList();
    }

    private static Collection<Language> stringToLanguages(Collection<String> languages) {
        return languages.stream()
                .map(languageName -> new Language(0L, languageName))
                .toList();
    }
}
